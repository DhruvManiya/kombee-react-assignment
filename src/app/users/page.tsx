"use client";
import React, { FC, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { notFound } from "next/navigation";
import PaginationTable from "@/components/common/table/PaginationTable";
import { useAtom } from "jotai";
import { userManagement } from "@/store/user-management.atom";
import axios, { AxiosError } from "axios";
import { IUserPaginationRes } from "../dto/user.dto";
import { Input, Popover, Select } from "@mantine/core";
import clsx from "clsx";
import TButton from "@/components/atoms/TButton";
import { Delete, Download, Filter, Trash } from "react-feather";
import { debounce } from "lodash";
import { tNotifications } from "@/components/atoms/TNotification";
import { CSVLink } from "react-csv";

export type ITableColumn = {
  label: string;
  key: keyof ITableUser; // `keyof IUser` ensures that the `key` corresponds to a property in IUser
};

export type ITableUser = {
  name: string;
  email: string;
  role: string;
  dob: string;
  gender_text: string;
  status_text: string;
};

const columns: ITableColumn[] = [
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Role", key: "role" },
  { label: "DOB", key: "dob" },
  { label: "Gender", key: "gender_text" },
  { label: "Status", key: "status_text" },
];
const UserPage: FC = () => {
  const [users, setUsers] = useAtom(userManagement);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [sort, setSort] = useState<"name" | "email" | "">("");
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  if (!Cookies.get("authToken") && !Cookies.get("user")) {
    return notFound();
  }

  const authToken = Cookies.get("authToken");
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;

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

  const debouncedFetchData = debounce(fetchData, 300);

  useEffect(() => {
    if (search) {
      debouncedFetchData();
    } else {
      fetchData();
    }

    return () => debouncedFetchData.cancel();
  }, [page, rowsPerPage, sort, order, search, authToken]);

  const userRows = useMemo(() => {
    return users.map((user) => {
      const row: { [key: string]: string } = {};
      columns.forEach((column) => {
        if (column.key === "role") {
          row[column.key] = user[column.key].name;
        } else {
          row[column.key] = user[column.key];
        }
      });
      return row;
    });
  }, [users, columns]);

  // In real life sceanario we use delete query here tp delete users
  const handleDelete = (emails: string[]) => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => !emails.includes(user.email))
    );

    setSelectedRows([]);
  };

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
          onChange={(e) => setSearch(e.target.value)}
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
          <CSVLink
            data={userRows}
            headers={columns}
            filename="user_data.csv"
            className="btn btn-primary"
          >
            <TButton className="!p-2">
              <Download size={20} />
            </TButton>
          </CSVLink>
          <div onClick={() => handleDelete(selectedRows)}>
            <TButton className="!p-2 !bg-red-600">
              <Trash size={20} />
            </TButton>
          </div>
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
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        userEmail={user.email}
        onDeleteRow={(id) => handleDelete([id])}
      />
    </div>
  );
};

export default UserPage;
