import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Table, { TableColumn } from "../Table";

type TestData = {
  name: string;
  age: number;
};

const columns: TableColumn[] = [
  { title: "Name", key: "name", sort: true },
  { title: "Age", key: "age", sort: true },
];

const data: TestData[] = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
];

describe("Table Component", () => {
  it("renders table headers and rows", () => {
    render(<Table titles={columns} content={data} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("calls onSort when sortable header is clicked", () => {
    const handleSort = jest.fn();

    render(
      <Table
        titles={columns}
        content={data}
        onSort={handleSort}
        sortValue={{ key: "name", value: 1 }}
      />
    );

    const nameHeader = screen
      .getByText("Name")
      .parentElement?.querySelector("span");
    expect(nameHeader).toBeInTheDocument();

    if (nameHeader) fireEvent.click(nameHeader);

    expect(handleSort).toHaveBeenCalledWith({ key: "name", value: -1 });
  });

  it("renders 'No Data Available' when content is empty", () => {
    render(<Table titles={columns} content={[]} />);

    expect(screen.getByText("No Data Available")).toBeInTheDocument();
  });
});
