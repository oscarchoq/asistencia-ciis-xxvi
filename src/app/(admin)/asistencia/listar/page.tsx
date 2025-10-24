import { getAsistencias } from "@/actions";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import { Title } from "@/components/ui/title/Title";

export default async function AsistenciaListarPage() {
  const { asistencias = [] } = await getAsistencias();

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Title title="Asistencias Registradas" />
        <div className="text-sm text-muted-foreground">
          Total: <span className="font-semibold">{asistencias.length}</span> asistencias
        </div>
      </div>
      <DataTable columns={columns} data={asistencias} toolbar={false} />
    </div>
  );
}
