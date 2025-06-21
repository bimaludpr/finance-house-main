import Link from "next/link";
import styles from "./Nav.module.css"; // We'll style this with CSS Modules

const Nav = () => {
  const menu = [
    {
      title: "Home",
      link: "/",
    },
    {
      title: "Annoncement",
      link: "/announcement/list",
    },
    {
      title: "Popups",
      link: "/popup/list",
    },
    {
      title: "Testimonial",
      link: "/testimonial/list",
    },
    {
      title: "Footer",
      link: "/footer/update",
    },
  ];

  const menuItems = Array.from({ length: 5 }, (_, i) => ({
    title: `Menu ${i + 1}`,
    link: "",
    links: Array.from({ length: 10 }, (_, j) => `/sub-link/${i + 1}-${j + 1}`),
  }));

  return (
    <nav className={styles.navbar}>
      <ul className={styles.menu}>
        {menu.map((item, index) => (
          <li key={index} className={styles.menuItem}>
            <Link href={item.link} className="link__title">
              <span className="link__title">{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
