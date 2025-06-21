import React from "react";
import { Form } from "react-bootstrap";
import styles from "./TextInput.module.css";

type RequiredType = boolean | { condition: boolean };

interface TextInputProps {
  label?: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  condition?: boolean;
  inputWidth?: number;
  inlineLabel?: boolean;
  required?: RequiredType;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  step?: number;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  className,
  style,
  disabled = false,
  condition = true,
  inputWidth,
  inlineLabel,
  required = false,
  onBlur,
  onKeyDown,
  maxLength,
  minLength,
  min,
  max,
  step,

}) => {
  const isRequired =
    typeof required === "object" ? required.condition : required === true;

  if (!condition) return null;

  return (
    <Form.Group controlId={name} className={`${className} ${styles.input_design}`}
      style={style}>
      {label && !inlineLabel && (
        <Form.Label className={styles.label}>
          {label}
          {isRequired && <span className="text-danger ms-1">*</span>}
        </Form.Label>
      )}
      <div className="d-flex align-items-center justify-content-center">
        <Form.Control
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          isInvalid={!!error}
          disabled={disabled}
          required={isRequired}
          style={{ width: inputWidth }}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          maxLength={maxLength}
          minLength={minLength}
          min={min}
          max={max}
          step={step}
          className={`${styles.input_field} ${className || ""}`}
        />
        {label && inlineLabel && (
          <Form.Label className="mx-2 mb-0">
            {label}
            {isRequired && <span className={styles.label}>*</span>}
          </Form.Label>
        )}
      </div>
      {error && (
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default TextInput;
