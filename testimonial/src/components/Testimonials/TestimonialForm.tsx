import dynamic from "next/dynamic";
import React, { FC, useState } from "react";
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
const Select = dynamic(() => import("home/Select"), {
  ssr: false,
}) as FC<any>;

interface TestimonialFormProps {
  mode: "add" | "edit";
  id?: string;
}

interface ProductOption {
  id: number;
  name: string;
}

interface FormValues {
  name_en: string;
  name_ar: string;
  review_en: string;
  review_ar: string;
  products: ProductOption[];
  image: File[] | [];
  is_enabled: boolean | null;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const validationSchema = Yup.object().shape({
  name_en: Yup.string().required("Customer name in English is required"),
  name_ar: Yup.string().required("Customer name in Arabic is required"),
  review_en: Yup.string().required("Review in English is required"),
  review_ar: Yup.string().required("Review in Arabic is required"),
  products: Yup.array().min(1, "At least one product must be selected"),
  image: Yup.array()
    .of(
      Yup.mixed().test("imageType", "Only image files are allowed", (file) =>
        file instanceof File ? file.type.startsWith("image/") : false
      )
    )
    .nullable(),
  is_enabled: Yup.boolean().nullable().required("Publish status is required"),
});

const TestimonialForm: React.FC<TestimonialFormProps> = ({ mode }) => {
  const [values, setValues] = useState<FormValues>({
    name_en: "",
    name_ar: "",
    review_en: "",
    review_ar: "",
    products: [],
    image: [],
    is_enabled: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const productOptions: ProductOption[] = [
    { id: 1, name: "Product 1" },
    { id: 2, name: "Product 2" },
    { id: 3, name: "Product 3" },
  ];

  const handleChange = (name: keyof FormValues, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleUpload = (
    name: string,
    files: File[],
    isInvalid: boolean,
    error?: string
  ) => {
    setValues((prev) => ({ ...prev, [name]: files }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    try {
      await validationSchema.validate(values, { abortEarly: false });
      console.log(
        `${mode === "edit" ? "Updating" : "Creating"} Testimonial`,
        values
      );
      setErrors({});
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: FormErrors = {};
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path as keyof FormValues] = error.message;
          }
        });
        setErrors(validationErrors);
      }
    }
  };

  return (
    <>
      <TextInput
        name="name_en"
        onChange={(e: { target: { value: any } }) =>
          handleChange("name_en", e.target.value)
        }
        value={values.name_en}
        placeholder="Enter name in English"
        label="Customer Name in English"
        error={errors.name_en}
        type="text"
        required
      />
      <TextInput
        name="name_ar"
        onChange={(e: { target: { value: any } }) =>
          handleChange("name_ar", e.target.value)
        }
        value={values.name_ar}
        placeholder="Enter name in Arabic"
        label="Customer Name in Arabic"
        error={errors.name_ar}
        type="text"
        required
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
      <TextEditor
        label="Review in English"
        value={values.review_en}
        onChange={(val: any) => handleChange("review_en", val)}
        height={300}
        required
        error={errors.review_en}
      />
      <TextEditor
        label="Review in Arabic"
        value={values.review_ar}
        onChange={(val: any) => handleChange("review_ar", val)}
        height={300}
        required
        error={errors.review_ar}
      />
      <Select
        title="Products"
        placeholder="Select products"
        options={productOptions}
        value={values.products}
        labelSetter={(e: { name: any }) => e.name}
        valueSetter={(e: { id: any }) => e.id}
        onChange={(val: any) => handleChange("products", val)}
        Multi2={true}
        required
      />
      <RadioButton
        name="is_enabled"
        label="Publish"
        options={[
          { value: "true", label: "Yes" },
          { value: "false", label: "No" },
        ]}
        checked={String(values.is_enabled)}
        onChange={(val: string) => handleChange("is_enabled", val === "true")}
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

export default TestimonialForm;
