import { Title } from "@/components/ui/title/Title";
import { getKitsPaginated } from "@/actions";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableWrapper } from "@/components/data-table/data-table-wrapper";
import { FilterConfig } from "@/interfaces/data-table";
import { columns } from "./columns";
import { checkModuleAccess } from "@/lib/auth-utils";

// Configuración de filtros
const filterConfigs: FilterConfig[] = [
  {
    column: "fecha_entrega",
    label: "Fecha de Entrega",
    type: "date",
    placeholder: "Seleccionar fecha",
  },
];

interface ListarKitsPageProps {
  searchParams: {
    page?: string;
    pageSize?: string;
    documento?: string;
    fecha_entrega?: string;
  };
}

export default async function ListarKitsPage({ searchParams }: ListarKitsPageProps) {
  // Validar acceso al módulo
  await checkModuleAccess('eventkit');
  
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

  if (resolvedSearchParams.fecha_entrega) {
    params.fecha_entrega = resolvedSearchParams.fecha_entrega;
  }

  const result = await getKitsPaginated(params);

  if (!result.ok) {
    return (
      <div className="max-w-7xl">
        <Title title="Kits Entregados" />
        <div className="text-center text-red-500 py-10">
          Error al cargar los kits
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Title title="Kits Entregados" />
      
      <DataTableWrapper>
        <DataTable
          columns={columns}
          data={result.kits}
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
