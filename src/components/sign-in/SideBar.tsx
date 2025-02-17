import clsx from "clsx";
import Image from "next/image";
import React, { FC, HTMLAttributes } from "react";
import signInBanner from "@/assets/sign-in-banner.jpg";
import signInLogo from "@/assets/logo.png";

type ISideBarProps = HTMLAttributes<HTMLDivElement> & {};

const SideBar: FC<ISideBarProps> = (props) => {
  const { className, ...other } = props;
  return (
    <div className={clsx("relative overflow-hidden", className)} {...other}>
      <Image
        src={signInBanner.src}
        alt="banner"
        height={signInBanner.height}
        width={signInBanner.width}
        className="absolute h-full w-full object-cover -z-10"
      />
      <div className="flex flex-col justify-between items-start p-12 h-full text-white">
        <Image
          src={signInLogo.src}
          alt="banner"
          height={signInLogo.height}
          width={signInLogo.width}
          className="w-3/5"
        />
        <h6 className="text-xl font-medium">Welcome to Eastern Techno Solutions!</h6>
        <p className="text-sm">© 2025 Eastern Techno Solutions</p>
      </div>
    </div>
  );
};

export default SideBar;
