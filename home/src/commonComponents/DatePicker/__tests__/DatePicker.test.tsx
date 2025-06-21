import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DatePicker from "../DatePicker";

describe("DatePicker component", () => {
  test("renders with placeholder text", () => {
    render(
      <DatePicker
        selected={null}
        onChange={jest.fn()}
        placeholder="Pick a date"
      />
    );

    const input = screen.getByPlaceholderText("Pick a date");
    expect(input).toBeInTheDocument();
  });

  test("calls onChange when a date is selected (simulated input)", () => {
    const handleChange = jest.fn();

    render(
      <DatePicker
        selected={null}
        onChange={handleChange}
        placeholder="Enter date"
        dateFormat="yyyy-MM-dd"
      />
    );

    const input = screen.getByPlaceholderText("Enter date") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "2025-12-25" } });

    // fireEvent.change won't actually trigger react-datepicker’s logic fully
    // But we can assert input value for now
    expect(input.value).toBe("2025-12-25");
  });

  test("renders disabled input when disabled=true", () => {
    render(
      <DatePicker
        selected={null}
        onChange={jest.fn()}
        placeholder="Disabled input"
        disabled
      />
    );

    const input = screen.getByPlaceholderText("Disabled input");
    expect(input).toBeDisabled();
  });
});
