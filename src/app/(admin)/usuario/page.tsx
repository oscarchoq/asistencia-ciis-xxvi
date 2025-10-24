import { getUsuarios } from "@/actions";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import { Title } from "@/components/ui/title/Title";
import { CreateUsuario } from "./ui/CreateUsuario";

export default async function UsuarioPage() {
  const { usuarios = [] } = await getUsuarios();

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Title title="Usuarios" />
        <CreateUsuario />
      </div>
      <DataTable
        columns={columns}
        data={usuarios}

        toolbar={false}
      />
    </div>
  );
}

