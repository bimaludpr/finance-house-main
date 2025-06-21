import React from "react";
import styles from "./Title.module.css";

interface TitleProps {
  content?: string;
  className?: string;
}

const Title: React.FC<TitleProps> = ({ content = "Title", className = "" }) => {
  return (
    <h1 id="Title" className={`${styles.title} ${className}`}>
      {content}
    </h1>
  );
};

Title.displayName = "Title";

export default Title;
