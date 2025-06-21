import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { FC } from "react";
import * as Yup from "yup";

const TextInput = dynamic(() => import("home/TextInput"), {
  ssr: false,
}) as FC<any>;
const CommonButton = dynamic(() => import("home/Button"), {
  ssr: false,
}) as FC<any>;
const DatePicker = dynamic(() => import("home/DatePicker"), {
  ssr: false,
}) as FC<any>;
const TextArea = dynamic(() => import("home/TextArea"), {
  ssr: false,
}) as FC<any>;
const RadioButton = dynamic(() => import("home/RadioButton"), {
  ssr: false,
}) as FC<any>;
const FileUpload = dynamic(() => import("home/FileUpload"), {
  ssr: false,
}) as FC<any>;
const TextEditor = dynamic(() => import("home/TextEditor"), {
  ssr: false,
}) as FC<any>;

interface PopupFormProps {
  mode: "add" | "edit";
  id?: string;
}

interface FormValues {
  english_text: string;
  arabic_text: string;
  start_date: Date | null;
  end_date: Date | null;
  is_enabled: boolean | null;
  link_type: boolean | null;
  link: string;
  link_file: File[] | [];
  image: File[] | [];
  arabic_image: File[] | [];
  urls: string[];
  frequency: number | null;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const validationSchema = Yup.object().shape({
  english_text: Yup.string()
    .required("Content in English is required")
    .max(100, "Content should be less than 100 words"),

  arabic_text: Yup.string()
    .required("Content in Arabic is required")
    .max(100, "Content should be less than 100 words"),

  start_date: Yup.date()
    .nullable()
    .required("Start date is required")
    .typeError("Start date is required"),

  end_date: Yup.date()
    .nullable()
    .required("End date is required")
    .typeError("End date is required"),

  is_enabled: Yup.boolean().nullable().required("Publish status is required"),

  link_type: Yup.boolean().nullable().required("Link type is required"),

  link: Yup.string().when("link_type", {
    is: true,
    then: (schema) =>
      schema.required("Link is required").url("Must be a valid URL"),
    otherwise: (schema) => schema.notRequired(),
  }),

  link_file: Yup.array()
    .of(
      Yup.mixed()
        .required("File is required")
        .test("fileType", "Only PDF files are allowed", (file) =>
          file instanceof File
            ? file.type === "application/pdf" ||
              file.name.toLowerCase().endsWith(".pdf")
            : false
        )
    )
    .when("link_type", {
      is: false,
      then: (schema) => schema.min(1, "At least one PDF file is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  image: Yup.array()
    .of(
      Yup.mixed().test("imageType", "Only image files are allowed", (file) =>
        file instanceof File ? file.type.startsWith("image/") : false
      )
    )
    .nullable(),

  arabic_image: Yup.array()
    .of(
      Yup.mixed().test("imageType", "Only image files are allowed", (file) =>
        file instanceof File ? file.type.startsWith("image/") : false
      )
    )
    .nullable(),

  frequency: Yup.number()
    .typeError("Frequency must be a number")
    .required("Frequency is required")
    .positive("Frequency must be a positive number")
    .integer("Frequency must be an integer"),
});

const PopupForm: React.FC<PopupFormProps> = ({ mode, id }) => {
  const [values, setValues] = useState<FormValues>({
    english_text: "",
    arabic_text: "",
    start_date: null,
    end_date: null,
    is_enabled: null,
    link_type: null,
    link: "",
    link_file: [],
    image: [],
    arabic_image: [],
    urls: [],
    frequency: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [newUrl, setNewUrl] = useState<string>("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  const handleUpload = (
    name: string,
    files: File[],
    isInvalid: boolean,
    error?: string
  ) => {
    console.log(files);
    setValues((prev) => ({ ...prev, [name]: files }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleChange = (name: keyof FormValues, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    try {
      await validationSchema.validate(values, { abortEarly: false });
      console.log(`${mode === "edit" ? "Updating" : "Creating"} Popup`, values);
      setErrors({});
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: FormErrors = {};
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path as keyof FormValues] =
              error.message || "";
          }
        });

        setErrors(validationErrors);
      }
    }
  };

  const handleAddOrUpdateUrl = async () => {
    const urlSchema = Yup.string()
      .required("URL is required")
      .url("Must be a valid URL");

    try {
      await urlSchema.validate(newUrl);
      setUrlError(null); // Clear previous error
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setUrlError(error.message);
        return;
      }
    }

    setValues((prev) => {
      const updatedUrls = [...prev.urls];
      if (editIndex !== null) {
        updatedUrls[editIndex] = newUrl;
      } else {
        updatedUrls.push(newUrl);
      }
      return { ...prev, urls: updatedUrls };
    });

    setNewUrl("");
    setEditIndex(null);
  };

  const handleEditUrl = (index: number) => {
    setNewUrl(values.urls[index]);
    setEditIndex(index);
  };

  const handleDeleteUrl = (index: number) => {
    setValues((prev) => {
      const updatedUrls = [...prev.urls];
      updatedUrls.splice(index, 1);
      return { ...prev, urls: updatedUrls };
    });
    if (editIndex === index) {
      setNewUrl("");
      setEditIndex(null);
    }
  };

  console.log(errors, values);

  return (
    <>
      <TextEditor
        label="Content in English"
        value={values.english_text}
        onChange={(val: any) => setValues({ ...values, english_text: val })}
        height={200}
      />

      <TextEditor
        label="Content in Arabic"
        value={values.arabic_text}
        onChange={(val: any) => setValues({ ...values, arabic_text: val })}
        direction="rtl"
        height={200}
      />
      <FileUpload
        label="Upload Image"
        buttonLabel="Upload"
        accept={["png", "jpg", "jpeg"]}
        maxFileSizeMB={50}
        multiple={false}
        files={values.image}
        onChange={handleUpload}
        name="image"
        error={errors.image}
      />

      <FileUpload
        label="Upload Arabic Image"
        buttonLabel="Upload"
        accept={["png", "jpg", "jpeg"]}
        maxFileSizeMB={50}
        multiple={false}
        files={values.arabic_image}
        onChange={handleUpload}
        name="arabic_image"
        error={errors.arabic_image}
      />
      <DatePicker
        label="Start Date"
        selected={values.start_date}
        onChange={(date: any) => handleChange("start_date", date)}
        dateFormat="dd MMM yyyy HH:mm aa"
        showTimeSelect
        showMonthDropdown
        timeIntervals={30}
        placeholder="Pick a start date and time"
        minDate={new Date()}
        maxDate={new Date(new Date().setDate(new Date().getDate() + 30))}
        error={errors.start_date}
        required
      />
      <DatePicker
        label="End Date"
        selected={values.end_date}
        onChange={(date: any) => handleChange("end_date", date)}
        dateFormat="dd MMM yyyy HH:mm aa"
        showTimeSelect
        showMonthDropdown
        timeIntervals={30}
        placeholder="Pick an end date and time"
        minDate={values.start_date ?? undefined}
        maxDate={new Date(new Date().setDate(new Date().getDate() + 30))}
        error={errors.end_date}
        required
      />
      <RadioButton
        name="link_type"
        label="Link Type"
        options={[
          { value: "link", label: "Link" },
          { value: "file", label: "File" },
        ]}
        checked={
          values.link_type === null ? "" : values.link_type ? "link" : "file"
        }
        onChange={(value: string) =>
          handleChange("link_type", value === "link")
        }
        inline
        error={errors.link_type}
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
        condition={values.link_type === true}
        required={{ condition: values.link_type === true }}
      />
      <FileUpload
        label="Choose File"
        buttonLabel="Upload"
        accept={["pdf", "PDF"]}
        maxFileSizeMB={5}
        multiple={false}
        files={values.link_file}
        onChange={handleUpload}
        name="link_file"
        error={errors.link_file}
        condition={values.link_type === false}
        required={{ condition: !values.link_type }}
      />

      <TextInput
        name="url_input"
        value={newUrl}
        onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
          setNewUrl(e.target.value)
        }
        label="Add URL"
        placeholder="Enter URL"
        type="text"
        error={urlError || ""}
      />

      <CommonButton
        label={editIndex !== null ? "Update URL" : "Add URL"}
        onClick={handleAddOrUpdateUrl}
      />

      {values.urls.length > 0 && (
        <table style={{ width: "100%", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>#</th>
              <th>URL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {values.urls.map((url, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{url}</td>
                <td>
                  <button type="button" onClick={() => handleEditUrl(index)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDeleteUrl(index)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <TextInput
        name="frequency"
        onChange={(e: { target: { value: any } }) =>
          handleChange(
            "frequency",
            e.target.value ? Number(e.target.value) : null
          )
        }
        value={values.frequency !== null ? String(values.frequency) : ""}
        placeholder="Enter frequency"
        label="Link"
        error={errors.frequency}
        type="number"
      />

      <RadioButton
        name="is_enabled"
        label="Publish"
        options={[
          { value: "true", label: "Yes" },
          { value: "false", label: "No" },
        ]}
        checked={String(values.is_enabled)}
        onChange={(value: string) =>
          handleChange("is_enabled", value === "true")
        }
        inline
        error={errors.is_enabled}
        required
      />
      <CommonButton
        label={mode === "edit" ? "Update" : "Submit"}
        onClick={handleSubmit}
      />
    </>
  );
};

export default PopupForm;