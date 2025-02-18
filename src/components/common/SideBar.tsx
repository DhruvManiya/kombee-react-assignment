import { FC, HTMLAttributes, useState } from "react";
import {
  IconUsers
} from "@tabler/icons-react";
import Image from "next/image";
import clsx from "clsx";
import signInLogo from "@/assets/logo.png";
import Link from "next/link";

const data = [
  { link: "/users", label: "Users", icon: IconUsers },
];

type ISideBarProps = HTMLAttributes<HTMLElement> & {};

export const SideBar: FC<ISideBarProps> = (props) => {
  const { className, ...other } = props;
  const [active, setActive] = useState("Users");

  return (
    <nav
      className={clsx(
        "h-screen w-[300px] p-4 flex flex-col border-r border-gray-700",
        "bg-[rgb(30_30_45)]",
        className
      )}
      {...other}
    >
      <div className="flex-1">
        <div className="pb-4 mb-6 border-b border-gray-700">
          <Image
            src={signInLogo.src}
            alt="banner"
            height={signInLogo.height}
            width={signInLogo.width}
            className="w-3/5"
          />
        </div>
        {data.map((item) => (
          <Link
            className={clsx(
              "flex items-center text-sm text-gray-300 px-4 py-2 rounded-lg font-medium transition duration-200",
              {
                "bg-primary-200/20 shadow-md text-white": item.label === active,
                "hover:bg-gray-700 hover:text-white": item.label !== active,
              }
            )}
            href={item.link}
            key={item.label}
            onClick={(event) => {
              event.preventDefault();
              setActive(item.label);
            }}
          >
            <item.icon className="mr-4 w-6 h-6 text-gray-400" stroke={1.5} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
