import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const PageNotFound = () => {
  return (
    <div className='flex flex-col-reverse md:flex-row min-h-[80vh] w-full justify-center items-center align-middle'>
      <div className='text-center px-5 mx-5'>
        <h2 className={`antialiased text-9xl`}>404</h2>

        <p className='font-semibold text-xl'>Whoops! Lo sentimos mucho.</p>
        <p className='font-light'>
          <span>Puedes regresar al
            <Link
              href={"/"}
              className='font-normal hover:underline transition-all'
            > inicio</Link>
          </span>
        </p>
      </div>

      <div className='px-5 mx-5'>
        <Image
          src={"/starman_750x750.png"}
          alt='Starman'
          className='p-5 sm:p-6'
          width={550}
          height={550}
          priority
        />
      </div>
    </div>
  )
}