import { getPlanes } from '@/actions'
import React from 'react'

export default async function page() {

  const planes = await getPlanes()
  return (
    <div>
      <h1>Home Page</h1>
      <pre>{JSON.stringify(planes, null, 2)}</pre>
    </div>
  )
}
