import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RadioButton from "../RadioButton";

describe("RadioGroup component", () => {
  const options = [
    { label: "Option A", value: "a" },
    { label: "Option B", value: "b" },
    { label: "Option C", value: "c" },
  ];

  test("renders all radio options with labels", () => {
    render(
      <RadioButton
        name="testRadio"
        options={options}
        selectedValue="b"
        onChange={() => {}}
        label="Test Radio Group"
      />
    );

    expect(screen.getByText("Test Radio Group")).toBeInTheDocument();
    options.forEach((opt) => {
      expect(screen.getByLabelText(opt.label)).toBeInTheDocument();
    });
  });

  test("marks the correct radio as checked", () => {
    render(
      <RadioButton
        name="testRadio"
        options={options}
        selectedValue="b"
        onChange={() => {}}
      />
    );

    expect(screen.getByDisplayValue("b")).toBeChecked();
    expect(screen.getByDisplayValue("a")).not.toBeChecked();
  });

  test("calls onChange when a different radio is clicked", () => {
    const handleChange = jest.fn();
    render(
      <RadioButton
        name="testRadio"
        options={options}
        selectedValue="a"
        onChange={handleChange}
      />
    );

    fireEvent.click(screen.getByLabelText("Option B"));
    expect(handleChange).toHaveBeenCalledWith("b");
  });

  test("disables all options if disabled=true", () => {
    render(
      <RadioButton
        name="testRadio"
        options={options}
        selectedValue="a"
        onChange={() => {}}
        disabled
      />
    );

    options.forEach((opt) => {
      expect(screen.getByLabelText(opt.label)).toBeDisabled();
    });
  });
});
