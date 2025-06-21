import React from "react";
import styles from './TextArea.module.css'
type RequiredType = boolean | { condition: boolean };

type TextAreaProps = {
  id: string;
  label?: string;
  placeholder?: string;
  value: string;
  rows?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: RequiredType;
  disabled?: boolean;
  className?: string;
  minLength?: number;
  maxLength?: number;
  error?: string;
  direction?: "ltr" | "rtl"; // ← NEW
};

const TextArea: React.FC<TextAreaProps> = ({
  id,
  label,
  placeholder = "",
  value,
  rows = 4,
  onChange,
  required = false,
  disabled = false,
  className = "",
  minLength,
  maxLength,
  error,
  direction = "ltr",
}) => {
  const isRequired =
    (typeof required === "object" && required.condition) ||
    (typeof required === "boolean" && required);

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label} {isRequired && <span className="text-danger">*</span>}
        </label>
      )}

      <textarea
        id={id}
        className={`${styles.textArea} ${className || ""} ${error ? "is-invalid" : ""}`}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={onChange}
        required={isRequired}
        disabled={disabled}
        minLength={minLength}
        maxLength={maxLength}
        dir={direction} // ← direction applied here
      />

      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};

export default TextArea;
