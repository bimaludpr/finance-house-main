// Imports
import dynamic from "next/dynamic";
import React, { FC, useState } from "react";
import * as yup from "yup";

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
const Checkbox = dynamic(() => import("home/Checkbox"), {
  ssr: false,
}) as FC<any>;

// Yup Schemas
const childSchema = yup.object().shape({
  name: yup.string().required("Child name is required"),
  name_ar: yup.string().required("Child Arabic name is required"),
  types: yup.array().of(yup.string()).required(),
  title: yup
    .string()
    .when("types", ([types = []], schema) =>
      types.includes("hasText") ? schema.required("Title is required") : schema
    ),
  image: yup
    .mixed()
    .when("types", ([types = []], schema) =>
      types.includes("hasImage")
        ? schema.required("Image is required")
        : schema.nullable()
    ),
  pageType: yup.string().oneOf(["internal", "external"]).required(),
  page: yup
    .string()
    .when("pageType", ([pageType], schema) =>
      pageType === "internal" ? schema.required("Page is required") : schema
    ),
  url: yup
    .string()
    .when("pageType", ([pageType], schema) =>
      pageType === "external"
        ? schema.required("URL is required").url("Must be a valid URL")
        : schema
    ),
});

const parentSchema = yup.object().shape({
  name: yup.string().required("Parent name is required"),
  name_ar: yup.string().required("Parent Arabic name is required"),
  children: yup.array().of(childSchema),
});

const parentsSchema = yup.array().of(parentSchema);

// Types
interface Child {
  name: string;
  name_ar: string;
  types: string[];
  title: string;
  image: File | null;
  pageType: "internal" | "external";
  page: string;
  url: string;
}

interface Parent {
  name: string;
  name_ar: string;
  children: Child[];
}

// Main Component
const FooterForm: React.FC = () => {
  const [parents, setParents] = useState<Parent[]>([
    {
      name: "",
      name_ar: "",
      children: [],
    },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const addParent = () => {
    setParents((prev) => [
      ...prev,
      {
        name: "",
        name_ar: "",
        children: [],
      },
    ]);
  };

  const addChild = (pIdx: number) => {
    const updated = [...parents];
    updated[pIdx].children.push({
      name: "",
      name_ar: "",
      types: [],
      title: "",
      image: null,
      pageType: "internal",
      page: "",
      url: "",
    });
    setParents(updated);
  };

  const handleParentChange = (idx: number, field: keyof Parent, value: any) => {
    const updated = [...parents];
    updated[idx][field] = value;
    setParents(updated);
  };

  const handleChildChange = <K extends keyof Child>(
    pIdx: number,
    cIdx: number,
    field: K,
    value: Child[K]
  ) => {
    const updated = [...parents];
    updated[pIdx].children[cIdx][field] = value;
    setParents(updated);
  };

  const handleChildTypesChange = (
    pIdx: number,
    cIdx: number,
    value: string[]
  ) => {
    handleChildChange(pIdx, cIdx, "types", value);
  };

  const handleSubmit = async () => {
    try {
      await parentsSchema.validate(parents, { abortEarly: false });
      alert("Validation passed! Submitting...");
      // Submit logic here
    } catch (err) {
      const validationErrors: Record<string, string> = {};
      if (err instanceof yup.ValidationError) {
        err.inner.forEach((e) => {
          if (e.path) validationErrors[e.path] = e.message;
        });
      }
      setErrors(validationErrors);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {parents.map((parent, pIdx) => (
        <div key={`parent-${pIdx}`} className="border p-4 rounded-md space-y-6">
          <TextInput
            name={`parent-name-${pIdx}`}
            label="Parent Name (EN)"
            value={parent.name}
            onChange={(e: { target: { value: any } }) =>
              handleParentChange(pIdx, "name", e.target.value)
            }
            error={errors[`parent-${pIdx}-name`]}
          />
          <TextInput
            name={`parent-name_ar-${pIdx}`}
            label="Parent Name (AR)"
            value={parent.name_ar}
            onChange={(e: { target: { value: any } }) =>
              handleParentChange(pIdx, "name_ar", e.target.value)
            }
            error={errors[`parent-${pIdx}-name_ar`]}
          />
          <CommonButton onClick={() => addChild(pIdx)} label="+ Add Child" />

          {parent.children.map((child, cIdx) => {
            const showImage = child.types.includes("hasImage");
            const showText = child.types.includes("hasText");

            return (
              <div key={`child-${pIdx}-${cIdx}`} className="ml-4 space-y-4">
                <TextInput
                  name={`child-name-${pIdx}-${cIdx}`}
                  label="Child Name (EN)"
                  value={child.name}
                  onChange={(e: { target: { value: string } }) =>
                    handleChildChange(pIdx, cIdx, "name", e.target.value)
                  }
                />
                <TextInput
                  name={`child-name_ar-${pIdx}-${cIdx}`}
                  label="Child Name (AR)"
                  value={child.name_ar}
                  onChange={(e: { target: { value: string } }) =>
                    handleChildChange(pIdx, cIdx, "name_ar", e.target.value)
                  }
                />
                <Checkbox
                  name={`child-types-${pIdx}-${cIdx}`}
                  label="Type"
                  options={[
                    { label: "Image", value: "hasImage" },
                    { label: "Text", value: "hasText" },
                  ]}
                  checked={child.types}
                  onChange={(val: string[]) =>
                    handleChildTypesChange(pIdx, cIdx, val)
                  }
                />
                {showImage && (
                  <FileUpload
                    label="Image Upload"
                    onChange={(name: any, files: (File | null)[]) =>
                      handleChildChange(pIdx, cIdx, "image", files[0])
                    }
                  />
                )}
                {showText && (
                  <>
                    <TextInput
                      name={`child-title-${pIdx}-${cIdx}`}
                      label="Title"
                      value={child.title}
                      onChange={(e: { target: { value: string } }) =>
                        handleChildChange(pIdx, cIdx, "title", e.target.value)
                      }
                    />
                    <RadioButton
                      name={`child-pageType-${pIdx}-${cIdx}`}
                      label="Page Type"
                      options={[
                        { label: "Internal Page", value: "internal" },
                        { label: "External URL", value: "external" },
                      ]}
                      checked={child.pageType}
                      onChange={(val: string) =>
                        handleChildChange(
                          pIdx,
                          cIdx,
                          "pageType",
                          val as "internal" | "external"
                        )
                      }
                    />
                    <TextInput
                      name={`child-page-or-url-${pIdx}-${cIdx}`}
                      label={child.pageType === "internal" ? "Page" : "URL"}
                      value={
                        child.pageType === "internal" ? child.page : child.url
                      }
                      onChange={(e: { target: { value: string } }) =>
                        handleChildChange(
                          pIdx,
                          cIdx,
                          child.pageType === "internal" ? "page" : "url",
                          e.target.value
                        )
                      }
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      ))}
      <CommonButton onClick={addParent} label="+ Add Parent" />
      <CommonButton onClick={handleSubmit} label="Submit" />
    </div>
  );
};

export default FooterForm;
