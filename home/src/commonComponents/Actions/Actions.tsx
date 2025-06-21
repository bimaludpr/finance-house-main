import React from "react";
import Link from "next/link";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

type ButtonConfig = {
  [key: string]: string | React.ReactNode;
};

type VisibilityConfig = {
  [key: string]: boolean;
};

type TooltipConfig = {
  [key: string]: string;
};

type OptionConfig = {
  [key: string]: {
    size?: number | string;
  };
};

type ActionProps = {
  className?: string;
  buttons?: ButtonConfig;
  visibility?: VisibilityConfig;
  rootPath?: string;
  tooltip?: TooltipConfig;
  options?: OptionConfig;
  [key: string]: any; // for dynamic props like onEdit, deleteLink, etc.
};

const actionStyles = {
  container: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  icon: {
    cursor: "pointer",
    transition: "opacity 0.2s ease",
  },
};

export default function Actions({
  className,
  buttons = {},
  visibility = {},
  rootPath = "",
  tooltip = {},
  options = {},
  ...props
}: ActionProps) {
  const t = (text: string) => text; // i18n placeholder

  const clickHandler = (btn: string) => {
    const funcName = "on" + btn[0].toUpperCase() + btn.slice(1);
    const func = props[funcName];
    if (typeof func === "function") func();
  };

  const renderTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props} style={{ fontSize: "12px" }}>
      {props.label}
    </Tooltip>
  );

  const Icon = ({
    btn,
    index,
    content,
    width,
    height,
    tooltip,
  }: {
    btn: string;
    index: number;
    content: string | React.ReactNode;
    width?: number | string;
    height?: number | string;
    tooltip?: string;
  }) => {
    const iconSize = {
      width: width ?? 20,
      height: height ?? 20,
    };

    let renderedContent: React.ReactNode;

    if (typeof content === "string") {
      renderedContent = (
        <img
          src={rootPath + content}
          alt={btn}
          style={{
            ...iconSize,
            objectFit: "contain",
          }}
        />
      );
    } else if (React.isValidElement(content)) {
      renderedContent = content;
    } else if (typeof content === "function") {
      renderedContent = React.createElement(content);
    } else {
      renderedContent = <span style={{ color: "red" }}>Invalid icon</span>;
    }

    return (
      <OverlayTrigger
        key={index}
        placement="bottom"
        delay={{ show: 250, hide: 400 }}
        overlay={renderTooltip({ label: t(tooltip || btn) })}
      >
        <span
          onClick={(e) => {
            e.stopPropagation();
            clickHandler(btn);
          }}
          style={{
            ...actionStyles.icon,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            ...iconSize,
          }}
        >
          {renderedContent}
        </span>
      </OverlayTrigger>
    );
  };

  return (
    <span style={actionStyles.container} className={className || ""}>
      {Object.keys(buttons).map((btn, index) => {
        const content = buttons[btn];
        const isVisible = visibility?.[btn];
        if (isVisible === false) return null;

        const linkData = props[btn + "Link"];
        const iconProps = {
          btn,
          index,
          content,
          width: options?.[btn]?.size,
          height: options?.[btn]?.size,
          tooltip: tooltip?.[btn],
        };

        return linkData ? (
          <Link
            key={index}
            href={{
              pathname: linkData.to,
              query: linkData.state,
            }}
            target="_blank"
          >
            <Icon {...iconProps} />
          </Link>
        ) : (
          <Icon key={index} {...iconProps} />
        );
      })}
    </span>
  );
}
