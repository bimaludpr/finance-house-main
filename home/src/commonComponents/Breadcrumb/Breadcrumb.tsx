"use client";

import { useRouter } from "next/router";
import React from "react";
import style from "./Breadcrumb.module.css";

interface BreadcrumbItem {
  path: string;
  name: string;
}

interface BreadcrumbProps {
  className?: string;
  content?: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  className = "",
  content = [],
}) => {
  const router = useRouter();

  const handleClick = (path: string) => {
    router.push(path);
  };

  return (
    <nav id="Breadcrumb" className={style.breadcrumb}>
      {content.map((item, i) => (
        <span
          key={i}
          className={style.breadcrumbItem}
          onClick={() => handleClick(item.path)}
        >
          {item.name}
        </span>
      ))}
    </nav>
  );
};

Breadcrumb.displayName = "Breadcrumb";

export default Breadcrumb;
