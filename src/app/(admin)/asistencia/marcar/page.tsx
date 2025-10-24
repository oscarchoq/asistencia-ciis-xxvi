import { Title } from '@/components/ui/title/Title'
import React from 'react'
import MarcarAsistenciaForm from './ui/MarcarAsistenciaForm'

export default function MarcarAsistenciaPage() {
  return (
    <div>
      <Title title='Marcar Asistencia' className='mb-20' />
      <MarcarAsistenciaForm />
    </div>
  )
}
