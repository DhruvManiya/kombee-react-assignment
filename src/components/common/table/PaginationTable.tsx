import React, {
  ChangeEvent,
  Dispatch,
  FC,
  HTMLAttributes,
  useState,
  useMemo,
} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Tooltip,
} from "@mui/material";
import { ArrowUp, Edit2, Eye, Trash2 } from "react-feather";
import clsx from "clsx";
import { ITableColumn, ITableUser } from "@/app/users/page";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAtom } from "jotai";
import { userManagement } from "@/store/user-management.atom";
import { IUser } from "@/app/dto/user.dto";

type IPaginationTableProps = HTMLAttributes<HTMLDivElement> & {
  columns: ITableColumn[];
  rows: {
    [key: string]: string;
  }[];
  count: number;
  page: number;
  rowsPerPage: number;
  setPage: Dispatch<React.SetStateAction<number>>;
  selectedRows: string[];
  setSelectedRows: Dispatch<React.SetStateAction<string[]>>;
  setRowsPerPage: Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  order: "desc" | "asc";
  setOrder: Dispatch<React.SetStateAction<"desc" | "asc">>;
  sort: "" | "email" | "name";
  setSort: Dispatch<React.SetStateAction<"" | "email" | "name">>;
  userEmail: string;
  onDeleteRow: (email: string) => void;
};

const PaginationTable: FC<IPaginationTableProps> = ({
  columns,
  rows,
  count,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  loading,
  order,
  setOrder,
  sort,
  setSort,
  userEmail,
  onDeleteRow,
  selectedRows,
  setSelectedRows,
  className,
  ...other
}) => {
  const [users] = useAtom(userManagement);
  const [editUser, setEditUser] = useState<IUser>();
  const [opened, { open, close }] = useDisclosure(false);

  const handleSelectRow = (email: string) => {
    setSelectedRows((prevSelected) => {
      if (prevSelected.includes(email)) {
        return prevSelected.filter((selectedEmail) => selectedEmail !== email);
      } else {
        return [...prevSelected, email];
      }
    });
  };

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allEmails = rows.map((row) => row.email);
      setSelectedRows(allEmails);
    } else {
      setSelectedRows([]);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleColumnClick = (column: keyof ITableUser) => {
    const newSortOrder = (prevOrder: "desc" | "asc") =>
      prevOrder === "asc" ? "desc" : "asc";

    if (column === "name" && sort !== "name") {
      setSort("name");
      setOrder("asc");
    } else if (column === "email" && sort !== "email") {
      setSort("email");
      setOrder("asc");
    } else {
      setOrder((prevOrder) => newSortOrder(prevOrder));
    }
  };

  const renderArrow = (column: keyof ITableUser) => {
    return (
      column === sort && (
        <ArrowUp
          className={clsx("inline rotate-0", order === "desc" && "rotate-180")}
        />
      )
    );
  };

  const handleSingleDelete = (email: string) => {
    onDeleteRow(email);
  };

  return (
    <div
      className={clsx("flex flex-col items-center p-4", className)}
      {...other}
    >
      <TableContainer component={Paper} className="shadow-lg !rounded-t-lg">
        <div className="overflow-x-auto relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[2px] z-50">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <Table className="min-w-full">
            <TableHead className="bg-primary-800">
              <TableRow>
                <TableCell
                  className="pl-4 sticky left-0 bg-transparent z-10"
                  style={{ minWidth: "60px" }}
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.length === rows.length && rows.length > 0
                    }
                    onChange={handleSelectAll}
                    className="w-5 h-5 border border-gray-300 rounded-lg bg-transparent focus:outline-none"
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={clsx(
                      "!text-base !font-bold !text-white",
                      ["name", "email"].includes(column.key) && "cursor-pointer"
                    )}
                    style={{ minWidth: "100px" }}
                    onClick={() => handleColumnClick(column.key)}
                  >
                    {column.label}&nbsp;&nbsp;
                    {renderArrow(column.key)}
                  </TableCell>
                ))}
                <TableCell
                  className="!text-base !font-bold !text-white !text-right !pr-8"
                  style={{ minWidth: "120px" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length !== 0 ? (
                rows.map((row) => (
                  <TableRow key={row.email} className="hover:bg-primary-100/50">
                    <TableCell
                      className="pl-4 sticky left-0 z-10"
                      style={{ minWidth: "60px" }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.email)}
                        onChange={() => handleSelectRow(row.email)}
                        className="w-5 h-5"
                      />
                    </TableCell>
                    {columns.map((column, colIdx) => (
                      <TableCell key={colIdx}>{row[column.key]}</TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Tooltip title="View" placement="top">
                          <button
                            onClick={() => {
                              setEditUser(
                                users.find((user) => user.email === row.email)
                              );
                              open();
                            }}
                            className="p-2 rounded-full hover:bg-gray-200 transition"
                          >
                            <Eye size={16} color="#4caf50" />
                          </button>
                        </Tooltip>
                        <Tooltip title="Edit" placement="top">
                          <button className="p-2 rounded-full hover:bg-gray-200 transition">
                            <Edit2 size={16} color="#ff9800" />
                          </button>
                        </Tooltip>
                        {row.email !== userEmail && (
                          <Tooltip title="Delete" placement="top">
                            <button
                              className="p-2 rounded-full hover:bg-gray-200 transition"
                              onClick={() => handleSingleDelete(row.email)}
                            >
                              <Trash2 size={16} color="#f44336" />
                            </button>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 2}
                    className="!text-center py-4 text-gray-500"
                  >
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </TableContainer>
      <div className="w-full flex justify-between items-center py-4">
        <TablePagination
          component="div"
          count={count}
          page={page - 1}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 20, 30, 50, 100]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className="bg-gray-50 p-2 w-full rounded-b-md shadow-inner"
        />
      </div>

      <Modal opened={opened} onClose={close} title="About User" size="xl" classNames={{header: "!bg-primary-800 !text-white", body: "!p-6"}}>
        {/* Here is too much duplication we can refactor it */}
        <div className="!w-full h-full max-h-[600px] flex flex-col gap-4">
          <div className="w-full px-4 flex">
            <span className="w-1/2 block text-secondary-800">Name:</span>
            <span className="w-1/2 block">{editUser?.name}</span>
          </div>
          <div className="w-full px-4 flex">
            <span className="w-1/2 block text-secondary-800">Email:</span>
            <span className="w-1/2 block">{editUser?.email}</span>
          </div>
          <div className="w-full px-4 flex">
            <span className="w-1/2 block text-secondary-800">Role</span>
            <span className="w-1/2 block">{editUser?.role.name}</span>
          </div>
          <div className="w-full px-4 flex">
            <span className="w-1/2 block text-secondary-800">D.O.B.:</span>
            <span className="w-1/2 block">{editUser?.dob}</span>
          </div>
          <div className="w-full px-4 flex">
            <span className="w-1/2 block text-secondary-800">Profile:</span>
            <span className="w-1/2 block">Comming soon</span>
          </div>
          <div className="w-full px-4 flex">
            <span className="w-1/2 block text-secondary-800">Gender:</span>
            <span className="w-1/2 block">{editUser?.gender_text}</span>
          </div>
          <div className="w-full px-4 flex">
            <span className="w-1/2 block text-secondary-800">Status:</span>
            <span className="w-1/2 block">{editUser?.status_text}</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaginationTable;
