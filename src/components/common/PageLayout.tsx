"use client";
import { usePathname } from "next/navigation";
import React, { FC, ReactNode } from "react";
import { SideBar } from "./SideBar";
import Navbar from "./Navbar";
import { pageMap } from "@/constants/page-name.constant";
import Cookies from "js-cookie";

type IPageLayoutProps = {
  children: ReactNode;
};

const PageLayout: FC<IPageLayoutProps> = (props) => {
  const { children } = props;

  const path = usePathname();

  if (
    (!Cookies.get("authToken") && !Cookies.get("user")) ||
    !pageMap.some((page) => page.path === path)
  ) {
    return children;
  }

  return (
    <main className="w-full flex bg-[rgb(213,231,236)]">
      <SideBar className="!w-80 fixed left-0 z-[99]" />
      <div className="w-[calc(100%-320px)] mt-16 ml-80">
        <Navbar className="fixed top-0 h-16 w-[calc(100%-320px)] right-0 z-[99]" />
        <section className="p-4 min-h-screen">{children}</section>
      </div>
    </main>
  );
};

export default PageLayout;
