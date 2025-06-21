import React from "react";
import styles from "./SearchInput.module.css";
import searchIcon from "./search.svg";
import closeIcon from "./close-icon.svg";
import TextInput from "../TextInput/TextInput";
import Image from "next/image";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; // Optional custom key handler
};

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  onKeyDown,
}) => {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSearchClick = () => {
    onChange(value); // Optional: trigger search again
  };

  const handleClearClick = () => {
    onClear();
  };

  return (
    <div className="card">
      <div className={styles.wrapper}>
        <Image
          src={searchIcon}
          alt="search"
          width={16}
          height={16}
          className={styles.searchIcon}
          onClick={handleSearchClick}
          role="button"
        />

        <TextInput
          name="search"
          type="text"
          value={value}
          inputWidth={300}
          onChange={handleInput}
          onKeyDown={onKeyDown}
          placeholder="Search"
          className={styles.inputField}
        />

        {value && (
          <Image
            src={closeIcon}
            alt="clear"
            width={16}
            height={16}
            className={styles.closeIcon}
            onClick={handleClearClick}
            role="button"
          />
        )}
      </div>
    </div>
  );
};

export default SearchInput;
