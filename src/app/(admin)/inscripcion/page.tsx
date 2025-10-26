import { Title } from "@/components/ui/title/Title";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import { getInscripciones } from "@/actions/inscripcion/get-inscripciones";
import { SyncButton } from "./ui/SyncButton";
import { CreateInscripcion } from "./ui/CreateInscripcion";
// import { SendEmailButton } from "./ui/SendEmailButton";

export default async function InscripcionesPage() {
  const { ok, inscripciones } = await getInscripciones();

  if (!ok || !inscripciones) {
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

      {/* <div className="flex justify-start">
        <SendEmailButton inscripciones={inscripciones} />
      </div> */}

      <DataTable
        columns={columns}
        data={inscripciones}
        customAction={<SyncButton />}
      />
    </div>
  );
}
