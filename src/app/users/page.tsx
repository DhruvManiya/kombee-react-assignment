"use client";
import React, { FC, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { notFound } from "next/navigation";
import PaginationTable from "@/components/common/table/PaginationTable";
import { useAtom } from "jotai";
import { userManagement } from "@/store/user-management.atom";
import axios from "axios";

const columns = ["Name", "Email", "Role", "DOB", "Gender", "Status"];

const UserPage: FC = () => {
  const [users, setUsers] = useAtom(userManagement);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  // In real life scenario, We use refresh Token strategy to keep our token alive. or if we don't, we need to send a falsy request to the server to know if token is still alive. and bases on that we rediarect user to not found!
  if (!Cookies.get("authToken") && !Cookies.get("user")) {
    return notFound();
  }

  const authToken = Cookies.get("authToken");

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/users?page=${page}&per_page=${limit}&search=${search}&filter=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setUsers(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(users);

  return (
    <div className="h-full bg-white rounded-2xl">
      UserPage
      <br />
      <PaginationTable columns={columns} />
    </div>
  );
};

export default UserPage;
