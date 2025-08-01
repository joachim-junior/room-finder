"use client";
import menu_data from "@/data/home-data/MenuData";
import Link from "next/link.js";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NavMenu = () => {
  const pathname = usePathname();
  const currentRoute = usePathname();
  const [navTitle, setNavTitle] = useState("");

  const isMenuItemActive = (menuLink: string) => {
    return currentRoute === menuLink;
  };

  const isSubMenuItemActive = (subMenuLink: string) => {
    return currentRoute === subMenuLink;
  };

  //openMobileMenu
  const openMobileMenu = (menu: any) => {
    if (navTitle === menu) {
      setNavTitle("");
    } else {
      setNavTitle(menu);
    }
  };

  return (
    <ul className="navbar-nav align-items-lg-center">
      {/* Only show the four main links, no icons */}
      {menu_data.map((menu: any) => (
        <li key={menu.id} className={`nav-item`}>
          <Link
            href={menu.link}
            className={`nav-link${pathname === menu.link ? " active" : ""}`}
          >
            {menu.title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavMenu;
