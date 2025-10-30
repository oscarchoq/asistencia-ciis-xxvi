import { getEventosPaginated } from "@/actions";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableWrapper } from "@/components/data-table/data-table-wrapper";
import { FilterConfig } from "@/interfaces/data-table";
import { columns } from "./columns";
import { Title } from "@/components/ui/title/Title";
import { CreateEvento } from "./ui/CreateEvento";
import { checkModuleAccess } from "@/lib/auth-utils";

// Configuración de filtros
const filterConfigs: FilterConfig[] = [
  {
    column: "fecha_evento",
    label: "Fecha de Evento",
    type: "date",
    placeholder: "Seleccionar fecha",
  },
];

interface EventoPageProps {
  searchParams: {
    page?: string;
    pageSize?: string;
    fecha_evento?: string;
  };
}

export default async function EventoPage({ searchParams }: EventoPageProps) {
  // Validar acceso al módulo (solo administrador)
  await checkModuleAccess('evento');
  
  const resolvedSearchParams = await searchParams;

  const page = Number(resolvedSearchParams.page) || 1;
  const pageSize = Number(resolvedSearchParams.pageSize) || 5;

  // Solo enviar parámetros si existen
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {
    page,
    pageSize,
  };

  if (resolvedSearchParams.fecha_evento) {
    params.fecha_evento = resolvedSearchParams.fecha_evento;
  }

  const result = await getEventosPaginated(params);

  if (!result.ok) {
    return (
      <div className="max-w-7xl">
        <Title title="Eventos" />
        <div className="text-center text-red-500 py-10">
          Error al cargar los eventos
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 mb-10">
      <div className="flex items-center justify-between">
        <Title title="Eventos" />
        <CreateEvento />
      </div>

      <DataTableWrapper>
        <DataTable
          columns={columns}
          data={result.eventos}
          filterConfigs={filterConfigs}
          totalCount={result.totalCount}
          pageCount={result.pageCount}
          currentPage={page}
          showSearch={false}
          toolbar={false}
        />
      </DataTableWrapper>
    </div>
  );
}
