import { getInscripciones } from '@/actions'
import React from 'react'

export default async function page() {

  const inscripciones = await getInscripciones()
  return (
    <div>
      <h1>Home Page</h1>
      <p>Ejemplo de obtener inscripciones</p>
      <pre>{JSON.stringify(inscripciones, null, 2)}</pre>
    </div>
  )
}
