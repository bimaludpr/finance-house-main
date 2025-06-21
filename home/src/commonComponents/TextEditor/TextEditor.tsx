"use client";

import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Form } from "react-bootstrap";
import style from './TextEditor.module.css'
type TinyMCEBlobInfo = {
  blob: () => Blob;
  filename: () => string;
};

type RequiredType = boolean | { condition: boolean };

type TextEditorProps = {
  value: string;
  onChange: (content: string) => void;
  onImageUpload?: (blobInfo: TinyMCEBlobInfo) => Promise<string>;
  height?: number;
  disabled?: boolean;
  plugins?: string[];
  toolbar?: string;
  direction?: "ltr" | "rtl";
  label?: string;
  className?: string;
  required?: RequiredType;
  minLength?: number;
  maxLength?: number;
  error?: string;
  name?: string;
};

const defaultPlugins = [
  "advlist",
  "autolink",
  "lists",
  "link",
  "image",
  "charmap",
  "preview",
  "anchor",
  "searchreplace",
  "visualblocks",
  "code",
  "fullscreen",
  "insertdatetime",
  "media",
  "table",
  "help",
  "wordcount",
];

const defaultToolbar =
  "undo redo | formatselect | bold italic underline strikethrough | " +
  "alignleft aligncenter alignright alignjustify | " +
  "bullist numlist outdent indent | link image media | code fullscreen preview | removeformat";

const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  onImageUpload,
  height = 500,
  disabled = false,
  plugins,
  toolbar,
  direction = "ltr",
  label,
  className = "",
  required,
  minLength,
  maxLength,
  error,
  name = "richTextEditor",
}) => {
  const isRequired =
    (typeof required === "object" && required.condition) ||
    (typeof required === "boolean" && required);

  const handleEditorChange = (content: string) => {
    if (minLength && content.length < minLength) return;
    if (maxLength && content.length > maxLength) return;
    onChange(content);
  };

  return (
    <Form.Group controlId={name} className={`mb-3 ${className}`}>
      {label && (
        <Form.Label htmlFor={name} className={style.label}>
          {label}
          {isRequired && <em className="text-danger ms-1">*</em>}
        </Form.Label>
      )}

      <Editor
        apiKey="37mfmray122y6mvza12s8jlr43zuuhoj53gvpeovii6ud4ij"
        value={value}
        onEditorChange={handleEditorChange}
        init={{
          height,
          menubar: true,
          plugins: plugins ?? defaultPlugins,
          toolbar: toolbar ?? defaultToolbar,
          directionality: direction,
          statusbar: false,
          branding: false,
          automatic_uploads: true,
          content_style: `
            body {
              font-family:Helvetica,Arial,sans-serif;
              font-size:14px;
              direction: ${direction};
            }
            p:empty::before {
              content: none !important;
            }
          `,
          images_upload_handler: async (
            blobInfo: TinyMCEBlobInfo,
            _progress: (percent: number) => void
          ) => {
            if (!onImageUpload) {
              throw new Error("Image upload handler not provided");
            }
            return await onImageUpload(blobInfo);
          },
        }}
      />

      {error && (
        <Form.Control.Feedback type="invalid" className="d-block">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default TextEditor;
