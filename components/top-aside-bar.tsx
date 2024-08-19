"use client";

import { signIn, signOut } from "@/auth/helper";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import React from "react";

const TopAsideBar = () => {
  const { data: session, status } = useSession();

  React.useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      redirect("/api/auth/signin");
    }
  }, [session, status]);

  const [isSidebarOpen, setIsSidebarOpen] = React.useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState<boolean>(false);
  const [isNavDropdownOpen, setIsNavDropdownOpen] =
    React.useState<boolean>(false);
  const pathname = usePathname();

  const toggleNavDropdown = () => {
    setIsNavDropdownOpen(!isNavDropdownOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdownUserBar = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div>
      <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                onClick={toggleSidebar}
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <a href="" className="flex ms-2 md:me-24">
                <img src="/favicon.ico" className="h-11 me-3" alt="IMS Logo" />
              </a>
            </div>

            <div className="relative flex items-center ms-3">
              <div className="flex flex-row items-center gap-1">
                <button
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  aria-expanded="false"
                  onClick={toggleDropdownUserBar}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src="/favicon.ico"
                    alt="user photo"
                  />
                </button>

                <div className="flex flex-col justify-center gap-0 ">
                  <div className=" p-0 text-sm font-semibold">
                    {session?.user.name}
                  </div>
                  <div className=" p-0 text-xs">{session?.user.email}</div>
                </div>
              </div>

              <div
                className={`absolute right-0 bottom-0 translate-y-full w-48 bg-white divide-y divide-gray-100 rounded shadow-lg dark:bg-gray-700 dark:divide-gray-600 ${
                  isDropdownOpen ? "block" : "hidden"
                }`}
                id="dropdown-user"
              >
                <div className="px-4 py-3">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {session?.user.name}
                  </p>
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300">
                    {session?.user.email}
                  </p>
                </div>
                <ul className="py-1">
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Earnings
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Sign out
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 border-r border-gray-200 bg-white`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                href={`${
                  session?.user.isSuperUser
                    ? "/manage/dashboard"
                    : "/home/dashboard"
                }`}
                className={`flex items-center p-2 text-gray-900 rounded-lg  ${
                  pathname === "/manage/dashboard"
                    ? "bg-gray-100"
                    : pathname === "/home/dashboard"
                    ? "bg-graye-100"
                    : ""
                } hover:bg-gray-100 group`}
              >
                <svg
                  className="w-5 h-5 text-blue-500 transition duration-75 group-hover:text-blue-700"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>

            <li>
              <Link
                href="/manage/users"
                className={`${
                  session?.user.isSuperUser ? "flex" : "hidden"
                } items-center p-2 text-gray-900 rounded-lg  ${
                  pathname === "/manage/users" ? "bg-gray-100" : ""
                } hover:bg-gray-100 group`}
              >
                <svg
                  className="w-5 h-5 text-blue-500 transition duration-75 group-hover:text-blue-700"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                  />
                </svg>

                <span className="ms-3">Users</span>
              </Link>
            </li>

            <li>
              <Link
                href="/manage/customers"
                className={`${
                  session?.user.isSuperUser ? "flex" : "hidden"
                } items-center p-2 text-gray-900 rounded-lg  ${
                  pathname === "/manage/customers" ? "bg-gray-100" : ""
                } hover:bg-gray-100 group`}
              >
                <svg
                  className="w-5 h-5 text-blue-500 transition duration-75 group-hover:text-blue-700"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                  />
                </svg>

                <span className="ms-3">Customers</span>
              </Link>
            </li>

            <li>
              <Link
                href="/home/customers"
                className={`${
                  !session?.user.isSuperUser ? "flex" : "hidden"
                } items-center p-2 text-gray-900 rounded-lg  ${
                  pathname === "/home/customers" ? "bg-gray-100" : ""
                } hover:bg-gray-100 group`}
              >
                <svg
                  className="w-5 h-5 text-blue-500 transition duration-75 group-hover:text-blue-700"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                  />
                </svg>

                <span className="ms-3">Customers</span>
              </Link>
            </li>

            <li>
              <Link
                onClick={toggleNavDropdown}
                className={` ${
                  session?.user.isSuperUser ? "hidden" : "flex"
                } items-center p-2 text-gray-900 rounded-lg  ${
                  pathname === "/home/cargo" ? "bg-gray-100" : ""
                } hover:bg-gray-100 group`}
                href={""}
              >
                <svg
                  className="w-6 h-6 text-blue-500 transition duration-75 group-hover:text-blue-700"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-width="2"
                    d="M3 13h1v6H3v-6zm16 0h1v6h-1v-6zM4 9h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zM6 15h1v1H6v-1zM10 15h1v1h-1v-1zM14 15h1v1h-1v-1zM18 15h1v1h-1v-1zM4 7v2h16V7H4zM4 11v2h16v-2H4z"
                  />
                </svg>

                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                  Cargo Receipts
                </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-chevron-down"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </Link>
              <ul
                className={`py-2 space-y-2 ${
                  isNavDropdownOpen ? "block" : "hidden"
                }`}
              >
                <Link
                  href={`${"/home/cargo-receipt/new"}`}
                  onClick={toggleNavDropdown}
                  className={`flex items-center p-2 pl-8 text-gray-900 rounded-lg hover:bg-gray-100 group`}
                >
                  <span className="ms-3">New Receipt</span>
                </Link>
                <Link
                  href={`${"/home/cargo-receipt/all"}`}
                  onClick={toggleNavDropdown}
                  className={`flex items-center p-2 pl-8 text-gray-900 rounded-lg hover:bg-gray-100 group`}
                >
                  <span className="ms-3">All Receipt</span>
                </Link>
              </ul>
            </li>

            <li>
              <Link
                href=""
                onClick={async () => {
                  await signOut();
                  window.location.reload();
                }}
                className={`flex items-center p-2 text-gray-900 rounded-lg   hover:bg-gray-100 group`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-log-out text-blue-500 transition duration-75 group-hover:text-blue-700"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" x2="9" y1="12" y2="12" />
                </svg>

                <span className="ms-3">Sign Out</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default TopAsideBar;
