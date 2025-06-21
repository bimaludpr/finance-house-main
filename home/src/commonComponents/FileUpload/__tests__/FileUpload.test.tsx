// src/commonComponents/FileUpload/__tests__/FileUpload.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FileUpload, { FileUploadProps } from "../FileUpload";

describe("FileUpload Component", () => {
  const setup = (props?: Partial<FileUploadProps>) => {
    const onChange = jest.fn();
    render(
      <FileUpload
        label="Upload Documents"
        buttonLabel="Select Files"
        accept={["pdf", "jpeg"]}
        maxFileSizeMB={2}
        multiple
        onChange={onChange}
        {...props}
      />
    );
    return { onChange };
  };

  it("renders label and button", () => {
    setup();
    expect(screen.getByText("Upload Documents")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Select Files" })
    ).toBeInTheDocument();
  });

  it("triggers file input on button click", () => {
    setup();
    const fileInput = screen.getByLabelText(/upload documents/i);
    const button = screen.getByRole("button", { name: "Select Files" });

    // Spy on input.click()
    const clickSpy = jest.spyOn(fileInput, "click");
    fireEvent.click(button);
    expect(clickSpy).toHaveBeenCalled();
  });

  it("calls onChange with valid files", () => {
    const { onChange } = setup();

    const file = new File(["dummy content"], "sample.pdf", {
      type: "application/pdf",
    });
    const input = screen.getByLabelText(
      /upload documents/i
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: { files: [file] },
    });

    expect(onChange).toHaveBeenCalledWith([file], false, "");
  });

  it("calls onChange with invalid format", () => {
    const { onChange } = setup();

    const file = new File(["dummy"], "file.exe", {
      type: "application/x-msdownload",
    });
    const input = screen.getByLabelText(
      /upload documents/i
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: { files: [file] },
    });

    expect(onChange).toHaveBeenCalledWith([file], true, "Invalid file format");
  });

  it("calls onChange with size error if total size exceeds limit", () => {
    const { onChange } = setup({ maxFileSizeMB: 0.0001 }); // ~100 bytes

    const file = new File(["a".repeat(1024)], "big.pdf", {
      type: "application/pdf",
    });
    const input = screen.getByLabelText(
      /upload documents/i
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: { files: [file] },
    });

    expect(onChange).toHaveBeenCalledWith(
      [file],
      true,
      expect.stringContaining("File size should not exceed")
    );
  });

  it("disables input and button when disabled is true", () => {
    setup({ disabled: true });

    const input = screen.getByLabelText(
      /upload documents/i
    ) as HTMLInputElement;
    const button = screen.getByRole("button");

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it("shows spinner when loading is true", () => {
    setup({ loading: true });

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
