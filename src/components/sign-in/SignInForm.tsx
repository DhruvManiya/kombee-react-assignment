"use client";
import clsx from "clsx";
import React, { FC, HTMLAttributes, useState } from "react";
import TInput from "../atoms/TInput";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios, { AxiosError } from "axios";
import { tNotifications } from "../atoms/TNotification";
import TButton from "../atoms/TButton";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ILoginResponse } from "@/app/dto/login.dto";
import { useAtom } from "jotai";
import { pageNameAtom } from "@/store/page-name.atom";
import { userAtom } from "@/store/user.atom";

type ISignInFormProps = HTMLAttributes<HTMLDivElement> & {};

type IDefaultValues = {
  email: string;
  password: string;
};

const defaultValues: IDefaultValues = {
  email: "",
  password: "",
};

const careerSchema = object().shape({
  email: string().required().email().label("Email"),
  password: string().trim().required().min(6).max(40).label("Password"),
});

const SignInForm: FC<ISignInFormProps> = (props) => {
  const router = useRouter();
  const [_pagename, setPageName] = useAtom(pageNameAtom);
  const [_user, setUser] = useAtom(userAtom);

  const { className, ...other } = props;
  const { handleSubmit, reset, control } = useForm({
    defaultValues: { ...defaultValues },
    resolver: yupResolver(careerSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmit = async (formData: IDefaultValues) => {
    try {
      setIsSubmitting(true);

      const endpoint = process.env.NEXT_PUBLIC_BASE_API_URL ?? "";

      const { email, password } = formData;
      const { data } = await axios.post<ILoginResponse>(
        `${endpoint}/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setUser(data.data);

      const { authorization } = data.data;

      Cookies.set("authToken", authorization);

      reset();
      tNotifications.success({
        title: "Success",
        message: "Form submitted successfully!",
      });
      setPageName("User management");
      router.push("/users");
    } catch (error) {
      console.log(error);

      tNotifications.error({
        title: "Error",
        message:
          (error as AxiosError).status === 427
            ? "Envalid email or password!"
            : (error as AxiosError).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={clsx(
        "h-full w-full flex flex-col items-center justify-center gap-12",
        className
      )}
      {...other}
    >
      <div className="flex flex-col items-center gap-2">
        <h6 className="text-2xl">Sign In</h6>
        <p className="text-sm text-secondary-300">
          Enter your username and password
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[630px] flex flex-col gap-6"
      >
        <TInput
          name="email"
          control={control}
          placeholder="Email *"
          className="w-full"
        />
        <TInput
          name="password"
          control={control}
          placeholder="Password *"
          type="password"
          className="w-full"
        />
        <TButton
          type="submit"
          className={clsx(
            "mt-4",
            isSubmitting && "bg-primary-700 cursor-not-allowed"
          )}
        >
          Submit
        </TButton>
      </form>
    </div>
  );
};

export default SignInForm;
