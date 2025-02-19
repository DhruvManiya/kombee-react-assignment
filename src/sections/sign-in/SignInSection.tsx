import SideBar from "@/components/sign-in/SideBar";
import SignInForm from "@/components/sign-in/SignInForm";
import clsx from "clsx";
import React, { FC, HTMLAttributes } from "react";

type ISignInSectionProps = HTMLAttributes<HTMLDivElement> & {};

const SignInSection: FC<ISignInSectionProps> = (props) => {
  const {className, ...other} = props;

    return (
    <section className={clsx("flex", className)} {...other}>
      <SideBar className="h-full w-[30%] flex flex-col justify-between items-start" />
      <SignInForm className="h-full w-[70%]" />
    </section>
  );
};

export default SignInSection;
