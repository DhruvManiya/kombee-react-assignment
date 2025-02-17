import { Button, ButtonProps } from "@mantine/core";
import clsx from "clsx";
import React, { FC } from "react";

type TButtonProps = ButtonProps & {
    type: "button" | "submit" | "reset"
};

const TButton: FC<TButtonProps> = (props) => {
  const { type, className, children, ...other } = props;
  return <Button type={type} className={clsx("bg-primary-800 hover:bg-primary-700 text-white text-center py-2 px-4 rounded", className)} {...other}>{children}</Button>;
};

export default TButton;
