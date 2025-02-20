"use client"
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const authToken = Cookies.get("authToken");
    const user = Cookies.get("user");

    if (!authToken || !user) {
      router.push("/sign-in");
    } else {
      router.push("/users");
    }
  }, [router]);

  return null;
};

export default HomePage;
