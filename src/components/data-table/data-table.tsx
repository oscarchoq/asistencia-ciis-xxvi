"use client";
import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
import { FilterConfig } from "@/interfaces/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Search, ChevronsLeft, ChevronsRight } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  toolbar?: boolean;
  pagination?: boolean;
  customAction?: React.ReactNode;
  // Nuevos props para paginación del servidor
  filterConfigs?: FilterConfig[];
  totalCount?: number;
  pageCount?: number;
  currentPage?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  toolbar = true,
  pagination = true,
  customAction,
  filterConfigs,
  totalCount,
  pageCount,
  currentPage,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Determinar si es paginación de servidor
  const isServerPagination = totalCount !== undefined && pageCount !== undefined;
  
  // Estado local para el input de búsqueda
  const [searchInput, setSearchInput] = useState(searchParams.get("documento") || "");
  
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: isServerPagination ? undefined : getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: isServerPagination ? undefined : getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      // Buscar solo en numero_documento
      const numeroDocumento = String(row.getValue("numero_documento") || "").toLowerCase();
      const searchValue = String(filterValue).toLowerCase().trim();
      return numeroDocumento.includes(searchValue);
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    ...(isServerPagination && {
      pageCount: pageCount,
      manualPagination: true,
    }),
  });

  // Función para actualizar URL con filtros
  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Resetear a página 1 cuando se filtra o cambia pageSize
    if (key !== "page") {
      params.set("page", "1");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const goToPage = (page: number) => {
    updateURL("page", String(page));
  };

  // Función para ejecutar la búsqueda
  const handleSearch = () => {
    updateURL("documento", searchInput);
  };

  // Manejar Enter en el input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Función para limpiar filtros (pero NO pageSize)
  const handleClearFilters = () => {
    const currentPageSize = searchParams.get("pageSize");
    setSearchInput("");
    const params = new URLSearchParams();
    if (currentPageSize) {
      params.set("pageSize", currentPageSize);
    }
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar personalizado para servidor */}
      {isServerPagination && (
        <div className="space-y-2">
          {/* Primera fila: Filtros y búsqueda */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-2">
              {/* Filtros dinámicos (primero los combos) */}
              {filterConfigs && filterConfigs.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {filterConfigs.map((filter) => {
                    const currentValue = searchParams.get(filter.column) || "RESET";
                    const selectedOption = filter.options?.find(opt => opt.value === currentValue);
                    const displayLabel = currentValue === "RESET" 
                      ? "Todos" 
                      : selectedOption?.label || currentValue;
                    
                    return (
                      <div key={filter.column} className="flex flex-col gap-1 w-full sm:w-auto">
                        <label className="text-xs font-medium text-muted-foreground px-1">
                          {filter.label}
                        </label>
                        <Select
                          value={currentValue}
                          onValueChange={(value) => {
                            if (value === "RESET") {
                              updateURL(filter.column, "");
                            } else {
                              updateURL(filter.column, value);
                            }
                          }}
                        >
                          <SelectTrigger className="h-9 w-full sm:w-[160px]">
                            <SelectValue>
                              <span>{displayLabel}</span>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="RESET">Todos</SelectItem>
                            {filter.options?.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Búsqueda por documento con botón de lupa pegado (después de los combos) */}
              <div className="flex flex-col gap-1 flex-1 sm:flex-none">
                <label className="text-xs font-medium text-muted-foreground px-1">
                  Buscador
                </label>
                <div className="flex items-center">
                  <Input
                    placeholder="Buscar por documento..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="h-9 rounded-r-none flex-1"
                  />
                  <Button
                    onClick={handleSearch}
                    size="sm"
                    className="h-9 rounded-l-none px-3"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Botón limpiar */}
              {(searchParams.get("documento") || Array.from(searchParams.keys()).some(key => key !== "page" && key !== "pageSize")) && (
                <div className="flex flex-col">
                  <label htmlFor="clear-filters" className="text-xs font-medium text-muted-foreground px-1">&nbsp;</label>
                <Button
                  variant="ghost"
                  onClick={handleClearFilters}
                  className="h-9 px-3"
                  >
                  Limpiar
                  <X className="ml-2 h-4 w-4" />
                </Button>
                  </div>
              )}
            </div>
            
            {/* Acción personalizada */}
            {customAction && <div className="flex sm:ml-auto">{customAction}</div>}
          </div>
        </div>
      )}
      
      {/* Toolbar original para cliente */}
      {!isServerPagination && toolbar && (
        <DataTableToolbar table={table} customAction={customAction} />
      )}
      
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
      
      {/* Paginación servidor */}
      {isServerPagination && pageCount && currentPage ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          {/* Contador de registros */}
          <div className="text-sm text-muted-foreground text-center sm:text-left">
            Mostrando {data.length} de {totalCount} inscripciones
          </div>
          
          {/* Controles de paginación */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
            {/* Selector de registros por página */}
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium whitespace-nowrap">Registros por página</p>
              <Select
                value={searchParams.get("pageSize") || "5"}
                onValueChange={(value) => updateURL("pageSize", value)}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top">
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Navegación de páginas */}
            <div className="flex items-center gap-4 sm:gap-6">
              <p className="text-sm font-medium whitespace-nowrap">
                Página {currentPage} de {pageCount}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => goToPage(1)}
                  disabled={currentPage <= 1}
                  title="Primera página"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  title="Página anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= pageCount}
                  title="Página siguiente"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => goToPage(pageCount)}
                  disabled={currentPage >= pageCount}
                  title="Última página"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        pagination && <DataTablePagination table={table} />
      )}
    </div>
  );
}