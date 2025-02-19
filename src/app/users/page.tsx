"use client";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { notFound } from "next/navigation";
import PaginationTable from "@/components/common/table/PaginationTable";
import { useAtom } from "jotai";
import { userManagement } from "@/store/user-management.atom";
import axios, { AxiosError } from "axios";
import { IUser, IUserPaginationRes } from "../dto/user.dto";
import TInput from "@/components/atoms/TInput";
import { Input, Popover, Select } from "@mantine/core";
import clsx from "clsx";
import { useDisclosure } from "@mantine/hooks";
import TButton from "@/components/atoms/TButton";
import { Filter } from "react-feather";
import { debounce } from "lodash";
import { tNotifications } from "@/components/atoms/TNotification";

const columns = ["Name", "Email", "Role", "DOB", "Gender", "Status"];

const UserPage: FC = () => {
  const [users, setUsers] = useAtom(userManagement);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [sort, setSort] = useState<"name" | "email" | "">("");
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState<boolean>(false);

  // In real life scenario, We use refresh Token strategy to keep our token alive. or if we don't, we need to send a falsy request to the server to know if token is still alive. and bases on that we rediarect user to not found!
  if (!Cookies.get("authToken") && !Cookies.get("user")) {
    return notFound();
  }

  const authToken = Cookies.get("authToken");

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
    }, 700),
    []
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get<IUserPaginationRes>(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/users`,
        {
          params: {
            page,
            per_page: rowsPerPage,
            search,
            order_by: order,
            sort,
          },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setUsers(data.data);
      setCount(data.total);
    } catch (error) {
      tNotifications.error({
        title: "Error",
        message:
          (error as AxiosError).status === 427
            ? "Envalid email or password!"
            : (error as AxiosError).config?.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, search, sort, order]);

  const userRows = useMemo(() => {
    return users.map(({ name, email, dob, gender_text, role, status_text }) => [
      name,
      email,
      role.name,
      dob,
      gender_text,
      status_text,
    ]);
  }, [users]);

  return (
    <div className="h-full bg-white rounded-2xl">
      <div className="pl-8 pt-12">
        <span className="bg-primary-100/60 w-fit px-8 py-4 rounded-2xl">
          Listing
        </span>
      </div>
      <br />
      <div className="px-8 flex justify-between">
        <Input
          classNames={{
            input: clsx(
              "!py-3 !text-md !text-black border-0 border-b border-b-slate-400 focus:!border-b-black rounded-none"
            ),
          }}
          className="relative !w-full !max-w-80"
          name="Search"
          placeholder="Search"
          value={search}
          onChange={(e) => debouncedSearch(e.target.value)}
        />
        <div className="flex gap-4">
          <Popover width={300} position="bottom-end" withArrow shadow="md">
            <Popover.Target>
              <TButton className="!p-2">
                <Filter size={20} />
              </TButton>
            </Popover.Target>
            <Popover.Dropdown>
              <Select
                disabled={true}
                label="Role"
                placeholder="Role"
                data={["React", "Angular", "Vue", "Svelte"]}
                comboboxProps={{ withinPortal: false }}
                onChange={(v) => console.log(v)}
              />
              <p className="text-red-500">
                disabled because not found any relavent API in given postman
                collection
              </p>
            </Popover.Dropdown>
          </Popover>
        </div>
      </div>
      <PaginationTable
        columns={columns}
        rows={userRows}
        count={count}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        loading={loading}
        sort={sort}
        setSort={setSort}
        order={order}
        setOrder={setOrder}
      />
    </div>
  );
};

export default UserPage;
