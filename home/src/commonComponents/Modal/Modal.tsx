import React from "react";
import { Modal } from "react-bootstrap";
import CommonButton from "../Button/Button";
import styles from "./Modal.module.css";

type CommonModalProps = {
  show: boolean;
  title?: string;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  onSave?: () => void;

  centered?: boolean;
  backdrop?: "static" | true | false;
  keyboard?: boolean;
  closeText?: string;
  submitText?: string;
};


const CommonModal: React.FC<CommonModalProps> = ({
  show,
  title,
  body,
  footer,
  onClose,
  onSave,

  centered = true,
  backdrop = true,
  keyboard = true,
  closeText = "Cancel",
  submitText = "Submit",
}) => {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered={centered}
      backdrop={backdrop}
      keyboard={keyboard}
      contentClassName={styles.modalContent}

      dialogClassName={styles.customDialog}
    >
      {title && (
        <Modal.Header closeButton className={styles.modalHeader}>
          <div className={styles.modalTitle}>{title}</div>
        </Modal.Header>
      )}

      <div className={styles.modalBody}>{body}</div>

      {footer !== undefined ? (
        <div className={styles.modalFooter}>{footer}</div>
      ) : (
        <div className={styles.modalFooter}>
          <CommonButton label={closeText} onClick={onClose} variant="danger" />
          {onSave && (
            <CommonButton label={submitText} onClick={onSave} variant="primary" />
          )}
        </div>
      )}
    </Modal>
  );
};

export default CommonModal;
