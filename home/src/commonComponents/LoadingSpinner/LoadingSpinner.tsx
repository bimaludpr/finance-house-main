import React from "react";
import { Spinner } from "react-bootstrap";

type LoadingSpinnerProps = {
  height?: number | string;
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ height = 200 }) => {
  return (
    <div
      style={{
        width: "100%",
        height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spinner animation="grow" />
    </div>
  );
};

export default LoadingSpinner;
