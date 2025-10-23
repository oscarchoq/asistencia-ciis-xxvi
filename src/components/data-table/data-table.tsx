"use client";
import { useState } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTableToolbar } from "@/components/data-table/data-table-tolbar";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";

// import { DataTablePagination } from "@/components/data-table-components/data-table-pagination";
// import { DataTableToolbar } from "@/components/data-table-components/data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  toolbar?: boolean;
  pagination?: boolean;
  customAction?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  toolbar = true,
  pagination = true,
  customAction,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      // Buscar en las columnas de numero_documento, nombres y apellidos
      const numeroDocumento = String(row.getValue("numero_documento") || "").toLowerCase();
      const nombres = String(row.getValue("nombres") || "").toLowerCase();
      const apellidos = String(row.getValue("apellidos") || "").toLowerCase();
      const searchValue = String(filterValue).toLowerCase().trim();
      
      // Combinar nombre completo para búsqueda agrupada
      const nombreCompleto = `${nombres} ${apellidos}`;
      
      // Si la búsqueda contiene espacios, buscar en el nombre completo
      // De lo contrario, buscar en cada campo individualmente
      if (searchValue.includes(" ")) {
        return nombreCompleto.includes(searchValue) || numeroDocumento.includes(searchValue);
      }
      
      return numeroDocumento.includes(searchValue) || 
             nombres.includes(searchValue) || 
             apellidos.includes(searchValue);
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div className="space-y-4">
      {toolbar && <DataTableToolbar table={table} customAction={customAction} />}
      {/* <DataTableToolbar table={table} /> */}
      <div className="overflow-y-auto rounded-md border">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && <DataTablePagination table={table} />}
    </div>
  );
}