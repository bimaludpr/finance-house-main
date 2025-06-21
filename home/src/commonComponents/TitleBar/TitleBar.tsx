import React, { useEffect, useState, ReactNode } from "react";
import styles from "./TitleBar.module.css";
import ArrowDownIcon from "./Icon ionic-ios-arrow-down tan.svg";

interface ToggleIcons {
  hide?: string;
  show?: string;
  size?: string;
}

interface TitleBarProps {
  title?: string;
  toggleButton?: boolean;
  defaultToggle?: "show" | "hide";
  top?: boolean;
  className?: string; // Used for variation, like css-tbr-esc2
  boxClassName?: string;
  children?: ReactNode;
  titleEndElement?: ReactNode;
  titleMore?: ReactNode;
  toggleIcons?: ToggleIcons;
  hideOnEmpty?: boolean;
  noPadding?: boolean;
  titleContent?: ReactNode;
}

const TitleBar: React.FC<TitleBarProps> = ({
  title,
  toggleButton = false,
  defaultToggle = "hide",
  top = false,
  className = "",
  boxClassName = "",
  children,
  titleEndElement,
  titleMore,
  toggleIcons = { hide: "", show: "", size: "" },
  hideOnEmpty = false,
  noPadding = false,
  titleContent,
}) => {
  const [expandToggle, setExpandToggle] = useState(false);

  useEffect(() => {
    if (defaultToggle === "show") {
      setExpandToggle(true);
    }
  }, [defaultToggle]);

  if (
    hideOnEmpty &&
    React.Children.toArray(children).every((child) => !child)
  ) {
    return null;
  }

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandToggle((prev) => !prev);
  };

  // Variation layout mapping
  const variationClass =
    className === "css-tbr-esc2"
      ? styles.cssTbrEsc2
      : className === "css-tbr-esc3"
      ? styles.cssTbrEsc3
      : className === "css-tbr-esc4"
      ? styles.cssTbrEsc4
      : className === "css-tbr-esc5"
      ? styles.cssTbrEsc5
      : className === "css-tbr-esc6"
      ? styles.cssTbrEsc6
      : "";

  const containerClass = `${styles.titleBar} ${variationClass}`.trim();
  const headerClass = `${styles.header} ${top ? styles.top : ""}`.trim();
  const sectionClass = `
    ${styles.expandableSection} 
    ${expandToggle || !toggleButton ? styles.tbShow : styles.tbHide}
    ${noPadding ? styles.noPadding : ""}
    ${boxClassName}
  `
    .replace(/\s+/g, " ")
    .trim();

  return (
    <div className={containerClass}>
      <div
        className={headerClass}
        onClick={() => setExpandToggle((prev) => !prev)}
        role="button"
        aria-expanded={expandToggle}
      >
        <h3>
          {titleContent}
          {title}
          {titleMore}
        </h3>
        <div className={styles.actions}>
          {titleEndElement}
          {toggleButton &&
            (toggleIcons.show || toggleIcons.hide ? (
              <img
                src={expandToggle ? toggleIcons.show : toggleIcons.hide}
                alt="toggle"
                style={{ width: toggleIcons.size }}
                onClick={handleToggleClick}
                className={styles.toggleIcon}
              />
            ) : (
              <img
                src={ArrowDownIcon}
                alt="toggle"
                className={`${styles.toggleIcon} ${
                  expandToggle ? styles.tbExpand : styles.tbCollapse
                }`}
                onClick={handleToggleClick}
              />
            ))}
        </div>
      </div>

      {children && <section className={sectionClass}>{children}</section>}
    </div>
  );
};

export default TitleBar;
