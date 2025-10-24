import { Title } from "@/components/ui/title/Title";
import { getKits } from "@/actions";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";

export default async function ListarKitsPage() {
  const { kits } = await getKits();

  return (
    <div className="space-y-6">
      <Title title="Kits Entregados" />
      <DataTable
        columns={columns}
        data={kits}
        toolbar={false}
      />
    </div>
  );
}
