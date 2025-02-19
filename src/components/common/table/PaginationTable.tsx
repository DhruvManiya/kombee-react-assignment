import React, { ChangeEvent, FC, HTMLAttributes, useState } from "react";
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
import { Edit2, Eye, Trash2 } from "react-feather";
import clsx from "clsx";

type IPaginationTableProps = HTMLAttributes<HTMLDivElement> & {
  columns: string[];
};

const sampleData = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `Item ${index + 1}`,
  description: `This is the description for item ${index + 1}`,
}));

const PaginationTable: FC<IPaginationTableProps> = (props) => {
  const { columns, className, ...other } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
      const allIds = currentData.map((row) => row.id);
      setSelectedRows(new Set(allIds));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const currentData = sampleData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div
      className={clsx("flex flex-col items-center p-4", className)}
      {...other}
    >
      <TableContainer component={Paper} className="shadow-lg !rounded-t-lg">
        <div className="overflow-x-auto">
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
                      currentData.every((row) => selectedRows.has(row.id))
                    }
                    onChange={handleSelectAll}
                    className="w-5 h-5 border border-gray-300 rounded-lg bg-transparent focus:outline-none"
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column}
                    className="!text-base !font-bold !text-white"
                    style={{ minWidth: "100px" }}
                  >
                    {column}
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
              {currentData.map((row) => (
                <TableRow key={row.id} className="hover:bg-primary-100/50">
                  <TableCell
                    className="pl-4 sticky left-0 z-10"
                    style={{ minWidth: "60px" }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                      className="w-5 h-5"
                    />
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.description}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </div>
      </TableContainer>
      <div className="w-full flex justify-center">
        <TablePagination
          component="div"
          count={sampleData.length}
          page={page}
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
