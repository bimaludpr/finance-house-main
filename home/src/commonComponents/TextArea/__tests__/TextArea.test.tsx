// components/common/__tests__/TextArea.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TextArea from "../TextArea";

describe("TextArea Component", () => {
  const defaultProps = {
    id: "test-textarea",
    label: "Test Label",
    placeholder: "Enter text...",
    value: "",
    onChange: jest.fn(),
  };

  it("renders without crashing", () => {
    render(<TextArea {...defaultProps} />);
    const textarea = screen.getByPlaceholderText("Enter text...");
    expect(textarea).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<TextArea {...defaultProps} />);
    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
  });

  it("does not render label when not provided", () => {
    const { queryByLabelText } = render(
      <TextArea {...defaultProps} label={undefined} />
    );
    expect(queryByLabelText("Test Label")).not.toBeInTheDocument();
  });

  it("calls onChange when text is entered", () => {
    render(<TextArea {...defaultProps} />);
    const textarea = screen.getByPlaceholderText("Enter text...");
    fireEvent.change(textarea, { target: { value: "Hello World" } });
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
  });

  it("disables the textarea when disabled is true", () => {
    render(<TextArea {...defaultProps} disabled={true} />);
    const textarea = screen.getByPlaceholderText("Enter text...");
    expect(textarea).toBeDisabled();
  });

  it("renders required asterisk when required is true", () => {
    render(<TextArea {...defaultProps} required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });
});
