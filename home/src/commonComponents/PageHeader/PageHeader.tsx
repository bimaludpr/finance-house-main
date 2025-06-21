import React, {
  CSSProperties,
  ReactNode,
  ReactElement,
  isValidElement,
  JSXElementConstructor,
} from "react";
import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  children?: ReactNode;
  style?: CSSProperties;
}

type DisplayableComponent = JSXElementConstructor<any> & {
  displayName?: string;
};

function getDisplayName(type: string | JSXElementConstructor<any>): string {
  if (typeof type === "string") return type;
  return (type as DisplayableComponent).displayName || "";
}

export default function PageHeader({ children, style }: PageHeaderProps) {
  const childArray = React.Children.toArray(children).filter(isValidElement);

  const titleChildren = childArray.filter((child) =>
    ["Title", "Breadcrumb"].includes(getDisplayName(child.type))
  );

  const buttonChildren = childArray.filter((child) =>
    ["Button", "StatusBox"].includes(getDisplayName(child.type))
  );

  console.log("titleChildren:", titleChildren);

  return (
    <div className={styles.pageHeader} style={style}>
      <div className={styles.title}>{titleChildren}</div>
      <div className={styles.buttons}>{buttonChildren}</div>
    </div>
  );
}
