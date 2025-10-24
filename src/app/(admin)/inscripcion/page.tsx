import { Title } from '@/components/ui/title/Title'
import { DataTable } from '@/components/data-table/data-table'
import { columns } from './columns'
import { getInscripciones } from '@/actions/inscripcion/get-inscripciones'
import { SyncButton } from './ui/SyncButton'
import { CreateInscripcion } from './ui/CreateInscripcion'

export default async function InscripcionesPage() {
  const { ok, inscripciones } = await getInscripciones()

  if (!ok || !inscripciones) {
    return (
      <div className='max-w-7xl'>
        <Title title='Inscripciones' />
        <div className='text-center text-red-500 py-10'>
          Error al cargar las inscripciones
        </div>
      </div>
    )
  }

  return (
    <div className=''>
      <Title title='Inscripciones' />

      <div className='flex justify-between items-center mb-5'>
        <CreateInscripcion />
      </div>

      <div className='mb-10'>
        <DataTable 
          columns={columns} 
          data={inscripciones}
          customAction={<SyncButton />}
        />
      </div>
    </div>
  )
}
