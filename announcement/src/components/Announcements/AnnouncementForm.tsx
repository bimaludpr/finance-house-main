"use client";
import dynamic from "next/dynamic";
import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/redux/store";
import {
  getAnnouncementDetail,
  insertAnnouncement,
  updateAnnouncement,
  uploadFile,
} from "src/services/api-announcement";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import {
  announcement_details,
  announcement_path,
} from "src/redux/announcementSlice";
import { IMAGE_BASE_URL } from "src/utils/constants/configuration";

// Dynamic imports
const TextInput = dynamic(() => import("home/TextInput"), { ssr: false });
const CommonButton = dynamic(() => import("home/Button"), { ssr: false });
const DatePicker = dynamic(() => import("home/DatePicker"), { ssr: false });
const TextArea = dynamic(() => import("home/TextArea"), { ssr: false });
const RadioButton = dynamic(() => import("home/RadioButton"), { ssr: false });
const FileUpload = dynamic(() => import("home/FileUpload"), { ssr: false });
const TitleBar = dynamic(() => import("home/TitleBar"), { ssr: false });
const PageHeader = dynamic(() => import("home/PageHeader"), { ssr: false });
const Title = dynamic(() => import("home/Title"), { ssr: false }) as FC<any>;
Title.displayName = "Title";
const Breadcrumb = dynamic(() => import("home/Breadcrumb"), {
  ssr: false,
}) as FC<any>;
Breadcrumb.displayName = "Breadcrumb";

interface AnnouncementFormProps {
  mode: "add" | "edit";
  id?: string;
}

interface EnrichedFile {
  name: string;
  url: string;
  type: string;
  metaFile?: File;
  isInvalid?: boolean;
  size?: number;
  response?: any;
  id?: string | number;
  alt?: string;
}

export interface AnnouncementData {
  title_en: string;
  title_ar: string;
  start_date: Date | null;
  end_date: Date | null;
  is_active: boolean | null;
  url_type: "link" | "file" | null;
  link?: string;
  link_file?: EnrichedFile[];
}

type AnnouncementPayload = AnnouncementData & {
  url: string;
  track_id: string;
  id?: string;
};

type FormErrors = Partial<Record<keyof AnnouncementData, string>>;

const validationSchema = Yup.object().shape({
  title_en: Yup.string()
    .required("Announcement in English is required")
    .max(100),
  title_ar: Yup.string()
    .required("Announcement in Arabic is required")
    .max(100),
  start_date: Yup.date().nullable().required("Start date is required"),
  end_date: Yup.date().nullable().required("End date is required"),
  is_active: Yup.boolean().nullable().required("Publish status is required"),
  url_type: Yup.string()
    .oneOf(["link", "file"])
    .required("Link type is required"),
  link: Yup.string().when("url_type", {
    is: "link",
    then: (schema) =>
      schema.required("Link is required").url("Must be a valid URL"),
    otherwise: (schema) => schema.notRequired(),
  }),
  link_file: Yup.array()
    .of(
      Yup.object().shape({
        metaFile: Yup.mixed()
          .required("File is required")
          .test("fileType", "Only PDF files are allowed", (file: any) => {
            return file && file.type === "application/pdf";
          }),
      })
    )
    .when("url_type", {
      is: "file",
      then: (schema) =>
        schema
          .min(1, "At least one PDF file is required")
          .required("File is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
});

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ mode, id }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const path = useSelector(announcement_path);
  const pageDetails = useSelector(announcement_details);

  const [values, setValues] = useState<AnnouncementData>({
    title_en: "",
    title_ar: "",
    start_date: null,
    end_date: null,
    is_active: null,
    url_type: null,
    link: "",
    link_file: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [trackId, setTrackId] = useState<string>("");

  useEffect(() => {
    if (id && mode === "edit") {
      dispatch(getAnnouncementDetail(id));
    }
  }, [id]);

  useEffect(() => {
    if (id && pageDetails) {
      setValues({
        title_en: pageDetails?.title_en,
        title_ar: pageDetails?.title_ar,
        start_date: pageDetails?.start_date,
        end_date: pageDetails?.end_date,
        is_active: pageDetails?.is_active,
        url_type: pageDetails?.url_type,
        link: pageDetails?.url_type !== "file" ? pageDetails?.url : "",
        link_file:
          pageDetails?.url_type === "file"
            ? [
              {
                type: pageDetails?.url?.split(".").pop(),
                url: `${IMAGE_BASE_URL}${path}/${pageDetails?.url}`,
                name: `${pageDetails?.url}`,
                response: `${pageDetails?.url}`,
              },
            ]
            : [],
      });
    }
  }, [id, pageDetails]);

  const handleUpload = (
    _name: string,
    enrichedFiles: EnrichedFile[],
    isInvalid: boolean,
    message: string,
    isClosing?: boolean
  ) => {
    setErrors((prev) => ({ ...prev, link_file: message || "" }));

    if (
      Array.isArray(enrichedFiles) &&
      enrichedFiles.some((f) => f.metaFile) &&
      !isClosing
    ) {
      const formData = new FormData();
      const generatedTrackId =
        trackId || Math.floor(1000 + Math.random() * 9000).toString();
      if (!trackId) setTrackId(generatedTrackId);
      formData.append("track_id", generatedTrackId);

      enrichedFiles.forEach((f) => {
        if (f.metaFile) formData.append("file", f.metaFile);
      });
      console.log(enrichedFiles, "hhh", formData);
      dispatch(
        uploadFile(formData, (res) => {
          const uploaded = enrichedFiles.map((file, i) => ({
            ...file,
            response: res?.data[i],
            id: res?.data[i] + i + 1,
            alt: "",
          }));
          setValues((prev) => ({ ...prev, link_file: uploaded }));
        })
      );
    } else {
      setValues((prev) => ({ ...prev, link_file: enrichedFiles }));
    }
  };

  const handleChange = (name: keyof AnnouncementData, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    try {
      await validationSchema.validate(values, { abortEarly: false });
      console.log(
        `${mode === "edit" ? "Updating" : "Creating"} Announcement`,
        values
      );
      setErrors({});
      const { link_file, link, ...rest } = values;

      let data: AnnouncementPayload = {
        ...rest,
        url:
          values?.url_type === "file"
            ? link_file?.[0]?.response ?? ""
            : values?.link,
        track_id: trackId,
      };
      console.log(data, "data");
      if (id) {
        data = {
          ...data,
          id: id,
        };
        dispatch(
          updateAnnouncement(data, (res) => {
            router.push("/announcement/list");
          })
        );
      } else {
        dispatch(
          insertAnnouncement(data, (res) => {
            router.push("/announcement/list");
          })
        );
      }
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: FormErrors = {};
        err.inner.forEach((error) => {
          if (error.path)
            validationErrors[error.path as keyof AnnouncementData] =
              error.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  console.log({ values });

  return (
    <>
      <PageHeader>
        <Title content={`${id ? "Update" : "Add"} Annoucement`} />
        <Breadcrumb
          content={[
            {
              name: "Home",
              path: "/",
            },
            {
              name: "Annoucement",
              path: "/announcement/list",
            },
            {
              name: id ? "Edit Annoucement" : "Add Annoucement",
            },
          ]}
        />
      </PageHeader>
      <TitleBar
        title={`${id ? "Update" : "Add"} Annoucement`}
        toggleButton
        defaultToggle={"show"}
      >
        <>
          <TextArea
            id="title_en"
            label="Announcement in English"
            value={values.title_en}
            onChange={(e: { target: { value: any } }) =>
              handleChange("title_en", e.target.value)
            }
            error={errors.title_en}
            maxLength={100}
            required
          />
          <TextArea
            id="title_ar"
            label="Announcement in Arabic"
            value={values.title_ar}
            onChange={(e: { target: { value: any } }) =>
              handleChange("title_ar", e.target.value)
            }
            direction="rtl"
            error={errors.title_ar}
            maxLength={100}
            required
          />

          <DatePicker
            label="Start Date"
            selected={values.start_date}
            onChange={(date: any) => handleChange("start_date", date)}
            placeholder="Pick a start date"
            error={errors.start_date}
            required
            minDate={new Date()}
          />

          <DatePicker
            label="End Date"
            selected={values.end_date}
            onChange={(date: any) => handleChange("end_date", date)}
            placeholder="Pick an end date"
            minDate={values.start_date ?? undefined}
            error={errors.end_date}
            required
          />
          <RadioButton
            name="url_type"
            label="Link Type"
            options={[
              { value: "link", label: "Link" },
              { value: "file", label: "File" },
            ]}
            checked={values.url_type ?? ""}
            onChange={(value: any) => handleChange("url_type", value)}
            inline
            error={errors.url_type}
            required
          />
          <TextInput
            name="link"
            onChange={(e: { target: { value: any } }) =>
              handleChange("link", e.target.value)
            }
            value={values.link}
            placeholder="Enter link"
            label="Link"
            error={errors.link}
            type="text"
            condition={values.url_type === "link"}
            required={{ condition: values.url_type === "link" }}
          />
          <FileUpload
            className="mb-3"
            buttonLabel="Upload File"
            accept={["pdf"]}
            maxFileSizeMB={5}
            multiple={false}
            files={values.link_file}
            onChange={handleUpload}
            error={errors.link_file}
            name="link_file"
            showPreview
            condition={values.url_type === "file"}
            required={{ condition: values.url_type === "file" }}
          />
          <RadioButton
            name="is_active"
            label="Active"
            options={[
              { value: "true", label: "Yes" },
              { value: "false", label: "No" },
            ]}
            checked={String(values.is_active)}
            onChange={(value: string) =>
              handleChange("is_active", value === "true")
            }
            inline
            error={errors.is_active}
            required
          />

          <CommonButton
            label={mode === "edit" ? "Update" : "Submit"}
            onClick={handleSubmit}
            variant="danger"
          />
        </>
      </TitleBar>
    </>
  );
};

export default AnnouncementForm;
