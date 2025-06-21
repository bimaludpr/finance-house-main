import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TestimonialForm from "../TestimonialForm";

jest.mock("src/commonComponents/Button/Button", () => ({ label, onClick }: any) => (
  <button onClick={onClick}>{label}</button>
));
jest.mock("src/commonComponents/FileUpload/FileUpload", () => ({ name, onChange }: any) => (
  <input
    data-testid={`file-upload-${name}`}
    type="file"
    onChange={(e) => onChange(name, Array.from(e.target.files || []), false)}
  />
));
jest.mock("src/commonComponents/RadioButton/RadioButton", () => ({ name, onChange, selectedValue }: any) => (
  <div>
    <label>
      <input
        type="radio"
        name={name}
        value="true"
        checked={selectedValue === "true"}
        onChange={() => onChange("true")}
      />
      Yes
    </label>
    <label>
      <input
        type="radio"
        name={name}
        value="false"
        checked={selectedValue === "false"}
        onChange={() => onChange("false")}
      />
      No
    </label>
  </div>
));
jest.mock("src/commonComponents/Select/Select", () => ({ onChange }: any) => (
  <select data-testid="product-select" multiple onChange={(e) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => ({
      id: parseInt(opt.value), name: opt.label
    }));
    onChange(selected);
  }}>
    <option value="1">Product 1</option>
    <option value="2">Product 2</option>
  </select>
));
jest.mock("src/commonComponents/TextEditor/TextEditor", () => ({ label, value, onChange }: any) => (
  <div>
    <label>{label}</label>
    <textarea
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
));
jest.mock("src/commonComponents/TextInput/TextInput", () => ({ label, name, value, onChange, type }: any) => (
  <div>
    <label htmlFor={name}>{label}</label>
    <input
      type={type}
      id={name}
      value={value}
      onChange={onChange}
      data-testid={name}
    />
  </div>
));

describe("TestimonialForm Component", () => {
  test("renders all fields", () => {
    render(<TestimonialForm mode="add" />);
    expect(screen.getByLabelText(/Customer Name in English/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Customer Name in Arabic/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Review in English/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Review in Arabic/i)).toBeInTheDocument();
    expect(screen.getByTestId("product-select")).toBeInTheDocument();
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
  });

  test("shows validation errors when fields are empty", async () => {
    render(<TestimonialForm mode="add" />);
    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(screen.getByText(/Customer name in English is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Customer name in Arabic is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Review in English is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Review in Arabic is required/i)).toBeInTheDocument();
      expect(screen.getByText(/At least one product must be selected/i)).toBeInTheDocument();
    });
  });

  test("submits form with valid data", async () => {
    console.log = jest.fn(); // intercept console.log

    render(<TestimonialForm mode="add" />);

    fireEvent.change(screen.getByTestId("name_en"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByTestId("name_ar"), { target: { value: "جون دو" } });
    fireEvent.change(screen.getByLabelText(/Review in English/i), { target: { value: "Great product!" } });
    fireEvent.change(screen.getByLabelText(/Review in Arabic/i), { target: { value: "منتج ممتاز" } });

    fireEvent.change(screen.getByTestId("product-select"), {
      target: {
        selectedOptions: [
          { value: "1", label: "Product 1" },
          { value: "2", label: "Product 2" }
        ]
      }
    });

    fireEvent.click(screen.getByLabelText(/Yes/)); // publish

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        "Creating Testimonial",
        expect.objectContaining({
          name_en: "John Doe",
          name_ar: "جون دو",
          review_en: "Great product!",
          review_ar: "منتج ممتاز",
          products: expect.arrayContaining([{ id: 1, name: "Product 1" }, { id: 2, name: "Product 2" }]),
          is_enabled: true,
        })
      );
    });
  });
});
