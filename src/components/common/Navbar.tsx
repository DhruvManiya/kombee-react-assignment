"use client";
import clsx from "clsx";
import React, { FC, HTMLAttributes } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Drawer } from "@mantine/core";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { pageMap } from "@/constants/page-name.constant";
import Cookies from "js-cookie";
import { logOut } from "@/utils/log-out.helper";

type INavbarProps = HTMLAttributes<HTMLElement> & {};

const Navbar: FC<INavbarProps> = (props) => {
  const { className, ...other } = props;
  const path = usePathname();
  const router = useRouter();

  const pageName = pageMap.find((page) => page.path === path)?.pageName;

  const userCookie = Cookies.get("user");

  const user = userCookie ? JSON.parse(userCookie) : null;

  const [opened, { open, close }] = useDisclosure(false);

  const onLogOut = () => {
    logOut();
    router.push("/sign-in");
  };

  return (
    <header
      className={clsx(
        "bg-white py-2 px-8 flex justify-between items-center",
        className
      )}
      {...other}
    >
      {pageName && <h1>{pageName}</h1>}
      <div className="flex justify-center items-center gap-1">
        <span className="text-secondary-400">Hi, </span>
        <span className="font-semibold">{user?.name ?? "User"}</span>
        {user?.profile && (
          <Image
            src={user.profile}
            alt="user"
            height={24}
            width={24}
            className="size-8 rounded-full ml-2 object-cover cursor-pointer"
            onClick={open}
          />
        )}
      </div>
      <Drawer
        opened={opened}
        onClose={close}
        title="Profile"
        position="right"
        size="xs"
        classNames={{ body: "flex flex-col gap-4 text-secondary-500" }}
      >
        {user && (
          <>
            <h6 className="text-xl">{user.name}</h6>
            <span>Role: {user.role}</span>
            <span>Email: {user.email}</span>
          </>
        )}
        <div
          className="bg-primary-200/20 shadow-md px-4 py-2 rounded-lg font-medium !w-full cursor-pointer"
          onClick={() => onLogOut()}
        >
          Log Out
        </div>
      </Drawer>
    </header>
  );
};

export default Navbar;
