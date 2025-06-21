import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Select from "../Select"; // adjust this path if needed
import "@testing-library/jest-dom";

const sampleOptions = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" },
];

describe("Custom Select Component", () => {
  it("renders title and required indicator", () => {
    render(
      <Select
        title="Fruits"
        options={sampleOptions}
        value={{ id: 1, name: "Apple" }}
        labelSetter={(e) => e.name}
        valueSetter={(e) => e.id}
        onChange={jest.fn()}
        required
      />
    );

    expect(screen.getByText("Fruits")).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("renders react-select in single select mode", () => {
    render(
      <Select
        options={sampleOptions}
        value={{ id: 1, name: "Apple" }}
        labelSetter={(e) => e.name}
        valueSetter={(e) => e.id}
        onChange={jest.fn()}
        isMulti={false}
        Multi2={false}
      />
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders MultiSelect when Multi2=true", () => {
    render(
      <Select
        options={sampleOptions}
        value={[{ id: 1, name: "Apple" }]}
        labelSetter={(e) => e.name}
        valueSetter={(e) => e.id}
        onChange={jest.fn()}
        Multi2={true}
      />
    );

    // Match the visible label (selected value), not placeholder
    expect(screen.getByText("Apple")).toBeInTheDocument();
  });

  it("calls onChange when selection changes in react-select", () => {
    const handleChange = jest.fn();

    render(
      <Select
        options={sampleOptions}
        value={{ id: 1, name: "Apple" }}
        labelSetter={(e) => e.name}
        valueSetter={(e) => e.id}
        onChange={handleChange}
        isMulti={false}
        Multi2={false}
      />
    );

    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(handleChange).toHaveBeenCalled();
  });
});
