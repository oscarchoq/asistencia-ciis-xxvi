// Tipos para paginación y filtros del servidor
export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface SortingState {
  id: string;
  desc: boolean;
}

export interface FilterConfig {
  column: string;
  label: string;
  type: "text" | "select" | "date";
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
}

export interface TableFilters {
  search?: string;
  [key: string]: string | undefined;
}

export interface ServerPaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageCount: number;
}

export interface DataTableConfig {
  searchableColumns?: string[]; // Columnas donde se puede buscar
  searchPlaceholder?: string; // Placeholder para el input de búsqueda
  filterColumns?: FilterConfig[]; // Configuración de filtros
  defaultPageSize?: number;
  defaultSorting?: SortingState[];
}
