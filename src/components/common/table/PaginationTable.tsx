import React, {
  ChangeEvent,
  Dispatch,
  FC,
  HTMLAttributes,
  useState,
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

type IPaginationTableProps = HTMLAttributes<HTMLDivElement> & {
  columns: string[];
  rows: string[][];
  count: number;
  page: number;
  rowsPerPage: number;
  setPage: Dispatch<React.SetStateAction<number>>;
  setRowsPerPage: Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  order: "desc" | "asc";
  setOrder: Dispatch<React.SetStateAction<"desc" | "asc">>;
  sort: "" | "email" | "name";
  setSort: Dispatch<React.SetStateAction<"" | "email" | "name">>;
};

const PaginationTable: FC<IPaginationTableProps> = (props) => {
  const {
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
    className,
    ...other
  } = props;
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const handleSelectRow = (id: number) => {
    setSelectedRows((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = currentData.map((_row, idx) => idx);
      setSelectedRows(new Set(allIds));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const currentData = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleColumnClick = (column: string) => {
    const newSortOrder = (prevOrder: "desc" | "asc") =>
      prevOrder === "asc" ? "desc" : "asc";

    if (column === "Name" && sort !== "name") {
      setSort("name");
      setOrder("asc");
    } else if (column === "Email" && sort !== "email") {
      setSort("email");
      setOrder("asc");
    } else {
      setOrder((prevOrder) => newSortOrder(prevOrder));
    }
  };

  const renderArrow = (column: string) => {
    return (
      ((column === "Name" && sort === "name") ||
        (column === "Email" && sort === "email")) && (
        <ArrowUp
          className={clsx("inline rotate-0", order === "desc" && "rotate-180")}
        />
      )
    );
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
                      currentData.length > 0 &&
                      currentData.every((_row, idx) => selectedRows.has(idx))
                    }
                    onChange={handleSelectAll}
                    className="w-5 h-5 border border-gray-300 rounded-lg bg-transparent focus:outline-none"
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column}
                    className={clsx(
                      "!text-base !font-bold !text-white",
                      (column === "Name" || column === "Email") &&
                        "cursor-pointer"
                    )}
                    style={{ minWidth: "100px" }}
                    onClick={() => handleColumnClick(column)}
                  >
                    {column}&nbsp;&nbsp;
                    {renderArrow(column)}
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
                rows.map((row, idx) => (
                  <TableRow key={idx} className="hover:bg-primary-100/50">
                    <TableCell
                      className="pl-4 sticky left-0 z-10"
                      style={{ minWidth: "60px" }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedRows.has(idx)}
                        onChange={() => handleSelectRow(idx)}
                        className="w-5 h-5"
                      />
                    </TableCell>
                    {row.map((cell) => (
                      <TableCell key={cell}>{cell}</TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Tooltip title="View" placement="top">
                          <button className="p-2 rounded-full hover:bg-gray-200 transition">
                            <Eye size={16} color="#4caf50" />
                          </button>
                        </Tooltip>
                        <Tooltip title="Edit" placement="top">
                          <button className="p-2 rounded-full hover:bg-gray-200 transition">
                            <Edit2 size={16} color="#ff9800" />
                          </button>
                        </Tooltip>
                        <Tooltip title="Delete" placement="top">
                          <button className="p-2 rounded-full hover:bg-gray-200 transition">
                            <Trash2 size={16} color="#f44336" />
                          </button>
                        </Tooltip>
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
      <div className="w-full flex justify-center">
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
    </div>
  );
};

export default PaginationTable;
