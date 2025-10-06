import React from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

const menuOptions = [
  {
    id: 1,
    name: "Home",
    path: "/dashboard",
  },
  {
    id: 2,
    name: "History",
    path: "/history",
  },
  {
    id: 3,
    name: "Pricing",
    path: "/pricing",
  },
  {
    id: 4,
    name: "Profile",
    path: "/profile",
  },
];

function Navbar() {
  return (
    <div className="drawer fixed z-50">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-300 w-full">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2 flex items-center gap-6">
            <Image src="/logo.svg" alt="logo" width={40} height={40} />
            <h1>Medicall AI</h1>
          </div>
          <div className="hidden flex-none lg:block">
            <div className="flex items-center gap-6">
              <ul className="menu menu-horizontal">
                {menuOptions.map((option) => (
                  <li key={option.id}>
                    <a href={option.path}>{option.name}</a>
                  </li>
                ))}
              </ul>
              <UserButton />
            </div>
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          {menuOptions.map((option) => (
            <li key={option.id}>
              <a href={option.path}>{option.name}</a>
            </li>
          ))}
          <li>
            <UserButton />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
