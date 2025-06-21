import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TextEditor from "../TextEditor";

// ✅ HOIST-SAFE MOCK
const mockUpload = jest.fn();

jest.mock("@tinymce/tinymce-react", () => {
  const React = require("react");
  const mockEditor = jest.fn(({ value, onEditorChange }: any) => (
    <textarea
      data-testid="mock-tinymce"
      defaultValue={value}
      onChange={(e) => onEditorChange(e.target.value)}
    />
  ));
  return {
    Editor: mockEditor,
    __esModule: true,
    mockEditor,
  };
});

// ✅ Re-import mockEditor safely after jest.mock
const { mockEditor } = jest.requireMock("@tinymce/tinymce-react");

describe("TextEditor Component", () => {
  beforeEach(() => {
    mockEditor.mockClear();
    mockUpload.mockClear();
  });

  it("renders mocked TinyMCE editor", () => {
    render(<TextEditor value="<p>Hello</p>" onChange={() => {}} />);
    const editor = screen.getByTestId("mock-tinymce");
    expect(editor).toBeInTheDocument();
  });

  it("calls onChange when content changes", () => {
    const handleChange = jest.fn();

    render(<TextEditor value="<p>Initial</p>" onChange={handleChange} />);
    const textarea = screen.getByTestId("mock-tinymce");
    fireEvent.change(textarea, { target: { value: "<p>Updated</p>" } });

    expect(handleChange).toHaveBeenCalledWith("<p>Updated</p>");
  });

  it("calls onImageUpload if provided", async () => {
    mockUpload.mockResolvedValue("http://localhost/image.png");

    render(
      <TextEditor value="" onChange={() => {}} onImageUpload={mockUpload} />
    );

    const blobInfo = {
      blob: () => new Blob(["mock-image"], { type: "image/png" }),
      filename: () => "test.png",
    };

    const props = mockEditor.mock.calls[0][0];
    const imageUrl = await props.init.images_upload_handler(blobInfo, () => {});

    expect(mockUpload).toHaveBeenCalledWith(blobInfo);
    expect(imageUrl).toBe("http://localhost/image.png");
  });
});
