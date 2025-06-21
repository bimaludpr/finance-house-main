"use client";

import React from "react";
import Image from "next/image";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import styles from "./AttachmentContent.module.css";

import closeIconPath from "./ac_close.svg";
import docIcon from "./ac_doc.svg";
import docxIcon from "./ac_docx.svg";
import mp4Icon from "./ac_mp4.svg";
import movIcon from "./ac_mov.svg";
import pdfIcon from "./ac_pdf.svg";
import xlsxIcon from "./ac_xlsx.svg";
import xlsIcon from "./ac_xls.svg";
import csvIcon from "./ac_csv.svg";
import pptxIcon from "./ac_pptx.svg";
import pptIcon from "./ac_ppt.svg";
import avifIcon from "./ac_avif.svg";
import svgIcon from "./ac_svg.svg";
import zipIcon from "./ac_zip.svg";
import errorFile from "./ac_errorFile.svg";
import { EnrichedFile } from "@/types/remote-modules";

interface AttachmentContentProps {
  files: EnrichedFile[];
  closeButton?: boolean;
  onClose?: (files: EnrichedFile[]) => void;
  label?: string;
  className?: string;
  closeIcon?: React.ReactNode;
}

const AttachmentContent: React.FC<AttachmentContentProps> = ({
  files,
  closeButton = false,
  onClose,
  label,
  className = "",
  closeIcon,
}) => {
  const fileIcons: Record<string, string> = {
    pdf: pdfIcon.src,
    doc: docIcon.src,
    docx: docxIcon.src,
    mov: movIcon.src,
    mp4: mp4Icon.src,
    xlsx: xlsxIcon.src,
    csv: csvIcon.src,
    ppt: pptIcon.src,
    pptx: pptxIcon.src,
    xls: xlsIcon.src,
    avif: avifIcon.src,
    svg: svgIcon.src,
    zip: zipIcon.src,
  };

  const fileParser = (file: EnrichedFile): [string, boolean] => {
    const ext = file.type?.toLowerCase() || file.url.split(".").pop()?.toLowerCase() || "";
    const icon = file.isInvalid ? errorFile.src : fileIcons[ext] || "file";
    const isImage = icon === "file" && !file.isInvalid;
    return [icon === "file" ? file.url : icon, isImage];
  };

  const handleClose = (fileToRemove: EnrichedFile) => {
    const updated = files.filter((f) => f !== fileToRemove);
    onClose?.(updated);
  };

  if (!files.length) return null;

  return (
    <div id="AttachmentContent" className={`${styles.attachmentContent} ${className}`}>
      {label && <p className={styles.label}>{label}</p>}
      <span className={styles.content}>
        {files.map((file, index) => {
          const [src, isImage] = fileParser(file);

          return (
            <span key={index} className={`${styles.fileContainer} ${isImage ? styles.image : ""}`}>
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={
                  <Tooltip id={`tooltip-${file.name}`} style={{ fontSize: "12px" }}>
                    {file.name}
                  </Tooltip>
                }
              >
                <a href={file.url} target="_blank" rel="noreferrer">
                  <img className={styles.file} src={src} alt={file.name} />
                </a>
              </OverlayTrigger>

              {closeButton && (
                <span className={styles.closeWrap} onClick={() => handleClose(file)}>
                  {closeIcon ? (
                    closeIcon
                  ) : (
                    <Image src={closeIconPath} alt="close" className={styles.close} />
                  )}
                </span>
              )}
            </span>
          );
        })}
      </span>
    </div>
  );
};

export default AttachmentContent;
