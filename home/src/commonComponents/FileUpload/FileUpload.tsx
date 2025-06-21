import React, { useState, useEffect } from "react";
import { Form, Spinner } from "react-bootstrap";
import AttachmentContent from "../AttachmentContent/AttachmentContent";
import uploadIcon from "./upload.svg";
import { EnrichedFile } from "@/types/remote-modules";

type FileUploadProps = {
  label?: string;

  accept?: string[];
  multiple?: boolean;
  maxFileSizeMB?: number;
  disabled?: boolean;
  loading?: boolean;
  onChange: (
    name: string,
    files: EnrichedFile[],
    isInvalid: boolean,
    errorMsg: string,
    isClosing?: boolean
  ) => void;
  name?: string;
  error?: string;
  className?: string;
  files?: EnrichedFile[];
  condition?: boolean;
  showPreview?: boolean;
  required?: boolean | { condition: boolean };
};

const fileParser = (type: string): string => {
  switch (type) {
    case "application/pdf":
    case "pdf":
      return "pdf";
    case "application/msword":
    case "doc":
      return "doc";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    case "docx":
      return "docx";
    case "image/jpeg":
    case "jpeg":
      return "jpeg";
    case "image/png":
    case "png":
      return "png";
    case "video/mp4":
    case "mp4":
      return "mp4";
    default:
      return "";
  }
};

const FileUpload: React.FC<FileUploadProps> = ({
  label,

  accept = ["pdf", "doc", "docx", "jpeg", "png"],
  multiple = false,
  maxFileSizeMB = 5,
  disabled = false,
  loading = false,
  onChange,
  name = "",
  error,
  className = "",
  files = [],
  condition = true,
  required = false,
  showPreview = true,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<EnrichedFile[]>(files);
  const [internalError, setInternalError] = useState<string>("");

  useEffect(() => {
    setSelectedFiles(files);
  }, [files]);

  if (!condition) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalError("");
    let fileList = Array.from(e.target.files || []);
    if (!multiple) fileList = fileList.slice(0, 1);

    const enrichedFiles: EnrichedFile[] = fileList.map((file) => {
      const type = fileParser(file.type);
      return {
        name: file.name,
        url: URL.createObjectURL(file),
        type,
        metaFile: file,
        isInvalid: !accept.includes(type),
        size: file.size,
      };
    });

    const totalSizeMB =
      enrichedFiles.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024);
    let isInvalid = false;
    let msg = "";

    if (totalSizeMB > maxFileSizeMB) {
      isInvalid = true;
      msg = `File size shouldn't exceed ${maxFileSizeMB} MB.`;
    }
    if (enrichedFiles.some((f) => f.isInvalid)) {
      isInvalid = true;
      msg = "Invalid file format.";
    }

    setSelectedFiles(enrichedFiles);
    onChange(name, enrichedFiles, isInvalid, msg);
  };

  const handleRemove = (updatedFiles: EnrichedFile[]) => {
    setSelectedFiles(updatedFiles);
    onChange(name, updatedFiles, false, "", true);
  };

  return (
    <Form.Group controlId={name} className={`mb-3 ${className}`}>
      {label && (
        <Form.Label>
          {label}{" "}
          {(typeof required === "boolean"
            ? required
            : typeof required === "object" && required?.condition) && (
              <span className="text-danger">*</span>
            )}
        </Form.Label>
      )}
      <div className="d-flex align-items-center gap-2">
        <Form.Control
          type="file"
          onChange={handleChange}
          accept={accept.map((ext) => "." + ext).join(",")}
          multiple={multiple}
          disabled={disabled}
          isInvalid={!!error || !!internalError}
          required={
            typeof required === "boolean"
              ? required
              : typeof required === "object" && required?.condition
          }
          style={{ "padding": "10px 12px" }}
        />
        {loading && <Spinner animation="border" size="sm" />}
      </div>
      {(internalError || error) && (
        <Form.Control.Feedback type="invalid" className="d-block">
          {internalError || error}
        </Form.Control.Feedback>
      )}
      {showPreview && selectedFiles.length > 0 && (
        <AttachmentContent
          files={selectedFiles}
          closeButton
          onClose={handleRemove}
        />
      )}
    </Form.Group>
  );
};

export default FileUpload;
