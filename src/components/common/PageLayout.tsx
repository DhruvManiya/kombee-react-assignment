"use client";
import { usePathname } from "next/navigation";
import React, { FC, HTMLAttributes, ReactNode } from "react";
import Cookies from "js-cookie";
import { SideBar } from "./SideBar";
import Navbar from "./Navbar";

type IPageLayoutProps = {
  children: ReactNode;
};

const PageLayout: FC<IPageLayoutProps> = (props) => {
  const { children } = props;

  const path = usePathname();

  if (!Cookies.get("authToken") && path === "/sign-in") {
    return children;
  }

  return (
    <main className="w-full flex bg-[rgb(213,231,236)]">
      <SideBar className="w-80" />
      <div className="w-[calc(100%-320px)]">
        <Navbar className="fixed top-0 h-16 w-[calc(100%-320px)] right-0" />
        <section className="pt-20 px-4 py-4">{children}</section>
      </div>
    </main>
  );
};

export default PageLayout;
