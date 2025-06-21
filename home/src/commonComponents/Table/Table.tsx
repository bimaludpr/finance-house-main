'use client';
import React, { useRef, useEffect, useState } from "react";
import styles from "./Table.module.css";
import Pagination from "../Pagination/Pagination";

export type TableColumn = {
  title: string;
  key: string;
  width?: string;
  span?: number;
  minWidth?: string;
  h_align?: "left" | "center" | "right";
  d_align?: "left" | "center" | "right";
  dir?: "ltr" | "rtl";
  sort?: boolean;
  condition?: boolean;
};

type SortValue = {
  key: string;
  value: number; // 1 = ASC, -1 = DESC
};

type TableProps<T> = {
  titles: TableColumn[];
  content: T[];
  className?: string;
  onSort?: (sort: SortValue) => void;
  sortValue?: SortValue;
  page?: number;
  pagesCount?: number;
  pageStatus?: string;
  onPageChange?: (page: number) => void;
  scroll_Max_Rows?: number;
  entriesCount?: number;
  setEntriesCount?: any;
};

export default function Table<T>({
  titles,
  content,
  className = "",
  onSort,
  sortValue,
  page,
  pagesCount,
  onPageChange,
  scroll_Max_Rows,
  entriesCount,
  setEntriesCount,
}: TableProps<T>) {
  const tableRef = useRef<HTMLTableElement>(null);
  const [tableHeight, setTableHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    if (!scroll_Max_Rows || content.length === 0) return;

    const row = tableRef.current?.querySelector("tbody tr");
    const head = tableRef.current?.querySelector("thead tr");
    const rowHeight = row?.clientHeight || 48;
    const headHeight = head?.clientHeight || 48;

    if (content.length > scroll_Max_Rows) {
      setTableHeight(rowHeight * scroll_Max_Rows + headHeight);
    } else {
      setTableHeight("auto");
    }
  }, [content, scroll_Max_Rows]);

  const sortHandler = (key: string) => {
    const isCurrent = sortValue?.key === key;
    const nextValue = isCurrent && sortValue?.value === 1 ? -1 : 1;
    onSort?.({ key, value: nextValue });
  };

  return (
    <>
      <div className="card">
        <div className="card-body">


          <div
            id="Table"
            className={`${styles.tableWrapper} ${className}`}
            style={{
              height: tableHeight,
              paddingTop: scroll_Max_Rows ? 0 : undefined,
            }}
          >
            <div className={styles.tableResponsive}>
              <table ref={tableRef} className={styles.table}>
                <thead>
                  <tr>
                    {titles.map((col, i) =>
                      col.condition === false ? null : (
                        <th
                          key={i}
                          colSpan={col.span}
                          style={{
                            width: col.width,
                            minWidth: col.minWidth || col.width,
                            textAlign: col.h_align,
                            position: scroll_Max_Rows ? "sticky" : undefined,
                            top: 0,
                          }}
                        >
                          {col.title}
                          {col.sort && col.key && (
                            <span
                              className={
                                sortValue?.key === col.key
                                  ? sortValue.value === 1
                                    ? styles.sortAsc
                                    : styles.sortDsc
                                  : styles.sortNeutral
                              }
                              onClick={() => sortHandler(col.key)}
                              role="button"
                            />
                          )}
                        </th>

                      )

                    )}

                  </tr>
                </thead>
                <tbody>
                  {content.length > 0 ? (
                    content.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {titles.map((col, colIndex) =>
                          col.condition === false ? null : (
                            <td
                              key={colIndex}
                              className={col.key}
                              dir={col.dir}
                              colSpan={col.span}

                            >
                              {
                                // @ts-ignore: Allow dynamic access
                                row[col.key]
                              }
                            </td>
                          )
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={titles.length} className="text-center">
                        No Data Available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {content.length > 0 && pagesCount && pagesCount > 1 && onPageChange && (
              <Pagination
                page={page ?? 0}
                pageCount={pagesCount}
                onPageChange={onPageChange}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
