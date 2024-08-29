"use client";

import { signOut } from "@/auth/helper";
import {
  LayoutDashboard,
  Power,
  ReceiptText,
  Users,
  UsersRound,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
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
              <Link href="" className="flex ms-2 md:me-24">
                <Image
                  src="/favicon.ico"
                  className="h-11  me-3"
                  height={44}
                  width={60}
                  alt="IMS Logo"
                  priority
                />
              </Link>
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
                  <Image
                    className=" rounded-full"
                    src="/favicon.ico"
                    height={32}
                    width={32}
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
                    <Link
                      href="/home/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Dashboard
                    </Link>
                  </li>

                  <li>
                    <Link
                      href=""
                      onClick={async () => {
                        await signOut();
                        window.location.reload();
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Sign out
                    </Link>
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
          <div className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="/home/dashboard"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                pathname === "/home/dashboard" ? "bg-gray-100 text-primary" : ""
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>

            <Link
              href="/home/customers"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                pathname === "/home/customers" ? "bg-gray-100 text-primary" : ""
              }`}
            >
              <Users className="h-4 w-4" />
              Customers
            </Link>

            <Link
              href="/home/cargo-receipts"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                pathname === "/home/cargo-receipts"
                  ? "bg-gray-100 text-primary"
                  : ""
              }`}
            >
              <ReceiptText className="h-4 w-4" />
              Receipts
            </Link>

            <Link
              href="/home/users"
              className={` items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                pathname === "/home/users"
                  ? "bg-gray-100 text-primary"
                  : !session?.user.isSuperUser
                  ? "hidden"
                  : "flex"
              }`}
            >
              <UsersRound className="h-4 w-4" />
              Users
            </Link>

            <Link
              href=""
              onClick={async () => {
                await signOut();
                window.location.reload();
              }}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary `}
            >
              <Power className="h-4 w-4" />
              Sign Out
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default TopAsideBar;
