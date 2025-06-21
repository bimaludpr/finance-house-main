import React from "react";
import ReactDatePicker from "react-datepicker";
import { Form } from "react-bootstrap";
import styles from "./DatePicker.module.css";
import "react-datepicker/dist/react-datepicker.css";

type RequiredType = boolean | { condition: boolean };

type Props = {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  dateFormat?: string;
  disabled?: boolean;
  dropdownMode?: "scroll" | "select";
  showMonthYearPicker?: boolean;
  minDate?: Date;
  maxDate?: Date;
  minTime?: Date;
  maxTime?: Date;
  placeholder?: string;
  dontTranslate?: boolean;
  showMonthDropdown?: boolean;
  showYearDropdown?: boolean;
  showTimeSelect?: boolean;
  showTimeSelectOnly?: boolean;
  timeIntervals?: number;
  label?: string;
  required?: RequiredType;
  error?: string;
  name?: string;
};

const DatePicker: React.FC<Props> = ({
  selected,
  onChange,
  dateFormat = "yyyy-MM-dd",
  disabled = false,
  dropdownMode = "select",
  showMonthYearPicker = false,
  minDate,
  maxDate,
  minTime,
  maxTime,
  placeholder = "Select date",
  dontTranslate = false,
  showMonthDropdown = false,
  showYearDropdown = false,
  showTimeSelect = false,
  showTimeSelectOnly = false,
  timeIntervals = 15,
  label,
  required = false,
  error,
  name = "date-picker",
}) => {
  const isRequired =
    (typeof required === "object" && required.condition) ||
    (typeof required === "boolean" && required);

  return (
    <Form.Group controlId={name} className={`mb-3`}>
      {label && (
        <Form.Label htmlFor={name} className={styles.label}>
          {label} {isRequired && <span className="text-danger">*</span>}
        </Form.Label>
      )}
      <div className={styles.datePickerWrapper}>
        <ReactDatePicker
          selected={selected}
          onChange={onChange}
          dateFormat={dateFormat}
          disabled={disabled}
          dropdownMode={dropdownMode}
          showMonthYearPicker={showMonthYearPicker}
          minDate={minDate}
          maxDate={maxDate}
          minTime={minTime}
          maxTime={maxTime}
          placeholderText={dontTranslate ? placeholder : placeholder}
          showMonthDropdown={showMonthDropdown}
          showYearDropdown={showYearDropdown}
          showTimeSelect={showTimeSelect || showTimeSelectOnly}
          showTimeSelectOnly={showTimeSelectOnly}
          timeIntervals={timeIntervals}
          className={`${styles.dateInput} ${error ? "is-invalid" : ""}`}
          name={name}
          required={isRequired}
          popperPlacement="bottom"
        />
      </div>


      {error && (
        <Form.Control.Feedback type="invalid" className="d-block">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default DatePicker;
