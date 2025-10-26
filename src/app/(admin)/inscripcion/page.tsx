import { columns } from "./columns";
import { CreateInscripcion } from "./ui/CreateInscripcion";
import { DataTable } from "@/components/data-table/data-table";
import { FilterConfig } from "@/interfaces/data-table";
import { getInscripcionesPaginated } from "@/actions";
import { SyncButton } from "./ui/SyncButton";
import { Title } from "@/components/ui/title/Title";

// Configuración de filtros
const filterConfigs: FilterConfig[] = [
  {
    column: "pago_validado",
    label: "Estado de Pago",
    type: "select",
    options: [
      { label: "Validado", value: "true" },
      { label: "Pendiente", value: "false" },
    ],
    placeholder: "Estado de Pago",
  },
  {
    column: "tipo_inscripcion",
    label: "Tipo de Inscripción",
    type: "select",
    options: [
      { label: "Presencial", value: "presencial" },
      { label: "Formulario", value: "virtual" },
    ],
    placeholder: "Tipo de Inscripción",
  },
];

interface InscripcionesPageProps {
  searchParams: {
    page?: string;
    pageSize?: string;
    documento?: string;
    pago_validado?: string;
    tipo_inscripcion?: string;
  };
}

export default async function InscripcionesPage({ searchParams }: InscripcionesPageProps) {
  const resolvedSearchParams = await searchParams;
  
  const page = Number(resolvedSearchParams.page) || 1;
  const pageSize = Number(resolvedSearchParams.pageSize) || 5; // ← Default: 5 registros
  
  // Solo enviar parámetros si existen
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {
    page: page,
    pageSize: pageSize,
  };
  
  if (resolvedSearchParams.documento) {
    params.documento = resolvedSearchParams.documento;
  }
  
  if (resolvedSearchParams.pago_validado) {
    params.pago_validado = resolvedSearchParams.pago_validado;
  }
  
  if (resolvedSearchParams.tipo_inscripcion) {
    params.tipo_inscripcion = resolvedSearchParams.tipo_inscripcion;
  }
  
  const result = await getInscripcionesPaginated(params);

  console.log(result)

  if (!result.ok) {
    return (
      <div className="max-w-7xl">
        <Title title="Inscripciones" />
        <div className="text-center text-red-500 py-10">
          Error al cargar las inscripciones
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
          <Title title="Inscripciones" />
        <CreateInscripcion />
      </div>

      <DataTable
        columns={columns}
        data={result.inscripciones}
        customAction={<SyncButton />}
        filterConfigs={filterConfigs}
        totalCount={result.totalCount}
        pageCount={result.pageCount}
        currentPage={page}
      />
    </div>
  );
}
