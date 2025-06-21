import React, { useState, ReactNode } from "react";
import FilterBox from "../../commonComponents/FilterBox/FilterBox";
import styles from "./FilterLayout.module.css";
import { Icon } from "@iconify/react";
import Button from '../../commonComponents/Button/Button'

type FilterLayoutProps = {
    children: ReactNode | ReactNode[];
    button?: ReactNode; // extra button, e.g., "Add Announcement"
    onSearch?: () => void;
    onClear?: () => void;
    isFilter?: boolean
};

export default function FilterLayout({
    children,
    button,
    onSearch,
    onClear,
    isFilter,
}: FilterLayoutProps) {
    const [toggle, setToggle] = useState(true);

    return (
        <div className="card" style={{ marginBottom: "40px" }}>
            <div className="card-body">
                <div className="buttons d-flex align-items-center justify-content-end w-full">
                    {isFilter && (
                        <button
                            onClick={() => setToggle((s) => !s)}
                            className="btn btn-light ms-2"
                        >
                            <Icon icon="mdi:tune" width={24} className="menu-icon" />
                        </button>
                    )}
                    {button}
                </div>
                {isFilter && (
                    <FilterBox
                        className={toggle ? "" : styles?.hide}
                        actions={
                            <div className="d-flex gap-2">
                                <Button
                                    label="Clear"
                                    onClick={onClear}
                                    variant="secondary"
                                />

                                <Button
                                    label="Submit"
                                    onClick={onSearch}
                                />
                            </div>

                        }
                    >
                        {children}
                    </FilterBox>
                )}

            </div >
        </div >
    );
}
