import { getEventos } from "@/actions";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import { Title } from "@/components/ui/title/Title";
import { CreateEvento } from "./ui/CreateEvento";

export default async function EventoPage() {
  const { eventos = [] } = await getEventos();

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Title title="Eventos" />
        <CreateEvento />
      </div>
      <DataTable columns={columns} data={eventos} toolbar={false} />
    </div>
  );
}
