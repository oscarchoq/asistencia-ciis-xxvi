import { Title } from '@/components/ui/title/Title'
import React from 'react'
import MarcarAsistenciaForm from './ui/MarcarAsistenciaForm'
import { checkModuleAccess } from '@/lib/auth-utils'

export default async function MarcarAsistenciaPage() {
  // Validar acceso al módulo
  await checkModuleAccess('asistencia');
  
  return (
    <div>
      <Title title='Marcar Asistencia' className='mb-20' />
      <MarcarAsistenciaForm />
    </div>
  )
}
