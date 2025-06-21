import React from "react";
import TextInput from "../TextInput/TextInput";
import styles from "./EntriesCounter.module.css";
import arrow from "./arrow.svg";
import Image from "next/image";

type EntriesCounterProps = {
  value: number | string;
  onChange: (value: number) => void;
  onCommit?: (value: number) => void;
};

const EntriesCounter: React.FC<EntriesCounterProps> = ({
  value,
  onChange,
  onCommit,
}) => {
  const updateValue = (val: number) => {
    if (val >= 0 && val <= 99) {
      onChange(val);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const parsed = parseInt(newValue, 10);
    if (!isNaN(parsed)) {
      updateValue(parsed);
    }
  };

  const commitValue = () => {
    const numericValue =
      typeof value === "string" ? parseInt(value, 10) : value;
    if (!isNaN(numericValue)) {
      onCommit?.(numericValue);
    }
  };

  const increase = () => {
    const numeric = Number(value);
    if (numeric < 99) onChange(numeric + 1);
  };

  const decrease = () => {
    const numeric = Number(value);
    if (numeric > 1) onChange(numeric - 1);
  };

  return (
    <div className="card">
      <div className={styles.entriesInputWrapper}>
        <TextInput
          name="entries"
          value={String(value)}
          type="number"
          inputWidth={80}
          min={0}
          max={99}
          step={1}
          className={styles.inputField}
          onChange={handleInputChange}
          onBlur={commitValue}
          onKeyDown={(e) => e.key === "Enter" && commitValue()}
        />
        <div className={styles.arrowButtons}>
          <Image
            src={arrow}
            alt="up"
            onClick={increase}
            width={11}
            height={8}
            className={styles.arrowUp}
          />
          <Image
            src={arrow}
            alt="down"
            width={11}
            height={8}
            onClick={decrease}
            className={styles.arrowDown}
          />
        </div>
      </div>
    </div>
  );
};

export default EntriesCounter;
