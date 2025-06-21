"use client";

import React, { useEffect, useState, ReactNode } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Style from "./Sidebar.module.css"
import clsx from 'clsx'
import Image from "next/image";
import CommonModal from "@/commonComponents/Modal/Modal";

interface MasterLayoutProps {
  children: ReactNode;
}

interface SubmenuItem {
  label: string;
  href: string;
}
interface MenuItem {
  label: string;
  icon: string;
  href?: string;
  submenu?: SubmenuItem[];
  matchPath?: string;
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: "material-symbols:dashboard",
    href: "/",
    matchPath: "/"
  },
  {
    label: "Announcements",
    icon: "material-symbols:speaker-phone-outline",
    href: "/announcement/list",
    matchPath: "/announcement",
  },
  {
    label: "Popup",
    icon: "mdi:information-outline",
    href: "/popup/list",
    matchPath: "/popup"
  },
  {
    label: "Testimonials",
    icon: "material-symbols:comment-outline",
    href: "/testimonial/list",
    matchPath: "/testimonial"
  },
  {
    label: "Footer",
    icon: "material-symbols:comment-outline",
    href: "/footer/update",
    matchPath: "/footer"
  },
];

const Sidebar: React.FC<MasterLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [sidebarActive, setSidebarActive] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [show, setShow] = useState(false)

  const toggleSidebar = () => setSidebarActive((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenu((prev) => !prev);
  const handleClick = () => setShow(true)
  const handleClose = () => setShow(false)
  const logoutHandler = () => {

  }


  useEffect(() => {
    if (typeof window === "undefined") return;
    const dropdownLinks = document.querySelectorAll(
      ".sidebar-menu .dropdown > a"
    );
    const handleDropdownClick = (e: Event) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLElement;
      const dropdown = target.closest(".dropdown");
      if (!dropdown) return;

      const isOpen = dropdown.classList.contains("open");
      document.querySelectorAll(".sidebar-menu .dropdown").forEach((el) => {
        el.classList.remove("open");
        const submenu = el.querySelector(".sidebar-submenu") as HTMLElement;
        if (submenu) submenu.style.maxHeight = "0px";
      });

      if (!isOpen) {
        dropdown.classList.add("open");
        const submenu = dropdown.querySelector(
          ".sidebar-submenu"
        ) as HTMLElement;
        if (submenu) submenu.style.maxHeight = `${submenu.scrollHeight}px`;
      }
    };

    dropdownLinks.forEach((el) =>
      el.addEventListener("click", handleDropdownClick)
    );

    return () => {
      dropdownLinks.forEach((el) =>
        el.removeEventListener("click", handleDropdownClick)
      );
    };
  }, [pathname]);

  return (
    <>
      <section
        className={
          mobileMenu
            ? `${Style["overlay"]} ${Style["active"]}`
            : Style["overlay"]
        }
      >
        <aside
          className={
            sidebarActive
              ? `${Style.sidebar} ${Style.active}`
              : mobileMenu
                ? `${Style.sidebar} ${Style["sidebar-open"]}`
                : Style.sidebar
          }
        >

          <button
            onClick={toggleMobileMenu}
            type="button"
            className={Style["sidebar-close-btn"]}
          >
            <Icon icon="radix-icons:cross-2" />
          </button>
          <div className={Style["sidebar-menu-area"]}>
            <ul className={Style["sidebar-menu"]}>


              {menuItems.map((item, idx) => (
                <li
                  key={idx}
                  className={item.submenu ? Style["dropdown"] : undefined}
                >
                  <Link
                    href={item.href || "#"}
                    className={
                      (item.matchPath === "/" && pathname === "/") ||
                        (item.matchPath !== "/" && pathname.startsWith(item.matchPath || ""))
                        ? Style["active-page"]
                        : ""
                    }
                  >
                    <Icon icon={item.icon} className={Style["menu-icon"]} />
                    <span>{item.label}</span>
                  </Link>

                  {item.submenu && (
                    <ul className={Style["sidebar-submenu"]}>
                      {item.submenu.map((sub, subIdx) => (
                        <li key={subIdx}>
                          <Link
                            href={sub.href}
                            className={pathname === sub.href ? Style["active-page"] : ""}
                          >
                            <span>• {sub.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}

            </ul>
          </div>
        </aside>

        <main
          className={
            sidebarActive
              ? `${Style["dashboard-main"]} ${Style.active}`
              : Style["dashboard-main"]
          }
        >
          <div className={Style["navbar-header"]}>
            <div className="row align-items-center justify-content-between">
              {/* Left: Sidebar toggle */}
              <div className="col-auto">
                <div className="d-flex flex-wrap align-items-center gap-4">
                  {/* Desktop toggle */}
                  <button
                    type="button"
                    className={Style["sidebar-toggle"]}
                    onClick={toggleSidebar}
                  >
                    <Icon
                      icon={
                        sidebarActive
                          ? "iconoir:arrow-right"
                          : "heroicons:bars-3-solid"
                      }
                      className={Style.icon}
                    />
                  </button>

                  {/* Mobile toggle */}
                  <button
                    type="button"
                    className={Style["sidebar-mobile-toggle"]}
                    onClick={toggleMobileMenu}
                  >
                    <Icon icon="heroicons:bars-3-solid" className={Style.icon} />
                  </button>
                </div>
              </div>


              <div className="col-auto">
                <div className={Style.userBar}>
                  <div className={Style.userInfo}>
                    <div className={Style.background}>
                      <Icon icon="mdi:account-circle-outline" className={Style.userIcon} />
                    </div>
                    <span className={Style.userName}>John</span>
                  </div>
                  <span className={Style.divider}>|</span>
                  <Icon icon="mdi:logout" onClick={handleClick} className={Style.logoutIcon} />
                </div>
              </div>
            </div>

          </div>

          <div className={Style["dashboard-main-body"]}>{children}</div>
        </main>
      </section >

      <CommonModal
        show={show}
        onClose={handleClose}
        onSave={logoutHandler}
        title="Logout"
        body={<p>Are you sure want to logout ?</p>}
        closeText="Cancel"
      />
    </>
  );
};

export default Sidebar;
