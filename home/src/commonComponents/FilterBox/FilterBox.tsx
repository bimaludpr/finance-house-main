import React from "react";
import { Col, Container, Row } from "react-bootstrap";

type Props = {
  children: React.ReactNode | React.ReactNode[];
  className: string;
  actions?: React.ReactNode;
};

const FilterBox = ({ children, className, actions }: Props) => {
  const columnsPerRow = 3;

  const childrenArray = React.Children.toArray(children);
  const allItems = actions ? [...childrenArray, actions] : childrenArray;

  const rows = allItems.reduce((acc: React.ReactNode[][], child, index) => {
    const rowIndex = Math.floor(index / columnsPerRow);
    if (!acc[rowIndex]) acc[rowIndex] = [];
    acc[rowIndex].push(child);
    return acc;
  }, []);

  const isActionSection = (i: number, j: number, row: React.ReactNode[]) => {
    return row.length === j + 1 && rows.length === i + 1;
  };

  return (
    <Container className={`m-0 p-0 w-full ${className}`}>
      {rows.map((row, i) => (
        <Row key={i} className="mb-3">
          {row.map((input, j) => (
            <Col
              key={j}
              md={4}
              className={
                isActionSection(i, j, row)
                  ? "mb-3 d-flex flex-column justify-content-end"
                  : ""
              }
            >
              {input}
            </Col>
          ))}
        </Row>
      ))}
    </Container>
  );
};

export default FilterBox;
