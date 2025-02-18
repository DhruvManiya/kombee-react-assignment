import { pageNameAtom } from "@/store/page-name.atom";
import { userAtom } from "@/store/user.atom";
import clsx from "clsx";
import { useAtom } from "jotai";
import React, { FC, HTMLAttributes } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Drawer } from "@mantine/core";
import Image from "next/image";

type INavbarProps = HTMLAttributes<HTMLElement> & {};

const Navbar: FC<INavbarProps> = (props) => {
  const [pageName] = useAtom(pageNameAtom);
  const [user] = useAtom(userAtom);
  console.log(user);
  
  const [opened, { open, close }] = useDisclosure(false);

  const { className, ...other } = props;
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
        <span className="font-semibold">{user?.name ? user.name : "User"}</span>
        {user?.profile && (
          <Image
            src={user.profile}
            alt="user"
            height={24}
            width={24}
            className="size-6 rounded-full ml-2"
            onClick={open}
          />
        )}
      </div>
      <Drawer opened={opened} onClose={close} title="Authentication" position="right">
        {/* Drawer content */}
      </Drawer>
    </header>
  );
};

export default Navbar;
