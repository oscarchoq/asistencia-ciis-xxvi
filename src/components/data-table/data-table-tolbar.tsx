"use client";

import { TrashIcon } from "lucide-react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  customAction?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  customAction,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [currenStatus, setCurrenStatus] = useState("TODOS");
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {table.getColumn("pago_validado") && (
          <Select
            value={currenStatus}
            onValueChange={(value) => {
              setCurrenStatus(value);
              if (value === "TODOS") {
                table.getColumn("pago_validado")?.setFilterValue(undefined);
                return;
              }
              table.getColumn("pago_validado")?.setFilterValue(value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado Pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"TODOS"}>TODOS</SelectItem>
                <SelectItem value={"VALIDADO"}>VALIDADO</SelectItem>
                <SelectItem value={"PENDIENTE"}>PENDIENTE</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        <Input
          placeholder="Buscar por documento, nombres..."
          value={searchValue}
          onChange={(event) => {
            const value = event.target.value;
            setSearchValue(value);
            // Aplicar filtro global en las columnas de número de documento, nombres y apellidos
            table.setGlobalFilter(value);
          }}
          className="h-8 w-[200px] lg:w-[300px]"
        />

        {(isFiltered || searchValue) && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              table.setGlobalFilter("");
              setCurrenStatus("TODOS");
              setSearchValue("");
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reiniciar
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <Button key="delete-button" variant="outline" size="sm">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Eliminar ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        )}
        {customAction && <div key="custom-action">{customAction}</div>}
      </div>
    </div>
  );
}