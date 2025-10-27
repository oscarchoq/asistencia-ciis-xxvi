import { getAsistenciasPaginated } from "@/actions";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableWrapper } from "@/components/data-table/data-table-wrapper";
import { FilterConfig } from "@/interfaces/data-table";
import { columns } from "./columns";
import { Title } from "@/components/ui/title/Title";
import { checkModuleAccess } from "@/lib/auth-utils";

// Configuración de filtros
const filterConfigs: FilterConfig[] = [
  {
    column: "fecha_asistencia",
    label: "Fecha de Asistencia",
    type: "date",
    placeholder: "Seleccionar fecha",
  },
];

interface AsistenciaListarPageProps {
  searchParams: {
    page?: string;
    pageSize?: string;
    documento?: string;
    fecha_asistencia?: string;
  };
}

export default async function AsistenciaListarPage({ searchParams }: AsistenciaListarPageProps) {
  // Validar acceso al módulo
  await checkModuleAccess('asistencia');
  
  const resolvedSearchParams = await searchParams;

  const page = Number(resolvedSearchParams.page) || 1;
  const pageSize = Number(resolvedSearchParams.pageSize) || 5;

  // Solo enviar parámetros si existen
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {
    page,
    pageSize,
  };

  if (resolvedSearchParams.documento) {
    params.documento = resolvedSearchParams.documento;
  }

  if (resolvedSearchParams.fecha_asistencia) {
    params.fecha_asistencia = resolvedSearchParams.fecha_asistencia;
  }

  const result = await getAsistenciasPaginated(params);

  if (!result.ok) {
    return (
      <div className="max-w-7xl">
        <Title title="Asistencias Registradas" />
        <div className="text-center text-red-500 py-10">
          Error al cargar las asistencias
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Title title="Asistencias Registradas" />
      </div>

      <DataTableWrapper>
        <DataTable
          columns={columns}
          data={result.asistencias}
          filterConfigs={filterConfigs}
          totalCount={result.totalCount}
          pageCount={result.pageCount}
          currentPage={page}
          toolbar={false}
        />
      </DataTableWrapper>
    </div>
  );
}
