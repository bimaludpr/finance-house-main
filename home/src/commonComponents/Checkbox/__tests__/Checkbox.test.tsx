import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Checkbox from "../Checkbox";

describe("CheckboxGroup component", () => {
  const options = [
    { label: "Reading", value: "reading" },
    { label: "Traveling", value: "traveling" },
    { label: "Gaming", value: "gaming" },
  ];

  test("renders label and all checkbox options", () => {
    render(
      <Checkbox
        name="hobbies"
        label="Select Hobbies"
        options={options}
        selectedValues={["traveling"]}
        onChange={() => {}}
      />
    );

    expect(screen.getByText("Select Hobbies")).toBeInTheDocument();
    options.forEach((option) => {
      expect(screen.getByLabelText(option.label)).toBeInTheDocument();
    });
  });

  test("checks correct checkboxes based on selectedValues", () => {
    render(
      <Checkbox
        name="hobbies"
        options={options}
        selectedValues={["reading", "gaming"]}
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText("Reading")).toBeChecked();
    expect(screen.getByLabelText("Gaming")).toBeChecked();
    expect(screen.getByLabelText("Traveling")).not.toBeChecked();
  });

  test("calls onChange with updated values on check and uncheck", () => {
    const handleChange = jest.fn();

    render(
      <Checkbox
        name="hobbies"
        options={options}
        selectedValues={["reading"]}
        onChange={handleChange}
      />
    );

    // Simulate checking "Traveling"
    fireEvent.click(screen.getByLabelText("Traveling"));
    expect(handleChange).toHaveBeenCalledWith(["reading", "traveling"]);

    // Simulate unchecking "Reading"
    fireEvent.click(screen.getByLabelText("Reading"));
    expect(handleChange).toHaveBeenCalledWith([]);
  });

  test("disables all checkboxes when disabled is true", () => {
    render(
      <Checkbox
        name="hobbies"
        options={options}
        selectedValues={[]}
        onChange={() => {}}
        disabled
      />
    );

    options.forEach((opt) => {
      expect(screen.getByLabelText(opt.label)).toBeDisabled();
    });
  });
});
