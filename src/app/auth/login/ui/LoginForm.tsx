"use client";
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { BsArrowRight } from 'react-icons/bs';
import clsx from 'clsx';
import { redirect } from 'next/navigation';
import { authenticate } from '@/actions';
import { IoInformationOutline } from 'react-icons/io5';

export const LoginForm = () => {

  const [state, distpach] = useActionState(authenticate, undefined)
  
  if (state === 'Success') {
    window.location.replace('/')
    redirect("/")  
  }

  return (
    <form action={distpach} className="flex flex-col">

      <label htmlFor="email">Correo electrónico</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="email"
        name='email'
      />

      <label htmlFor="email">Contraseña</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="password"
        name='password'
      />

      <div
        className='flex h-8 items-center space-x-1 mb-5'
        aria-live='polite'
        aria-atomic='true'
      >
        {state === "CredentialsSignin" && (
          <>
            <IoInformationOutline className='h-5 w-5 text-red-500' />
            <p className='text-sm text-red-500'>Credenciales incorrectas</p>
          </>
        )}
      </div>

      <LoginButton />

    </form>
  )
}

function LoginButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type='submit'
      className={
        clsx(
          'w-full flex flex-row',
          {
            'btn-primary': !pending,
            'btn-disabled': pending
          }
        )
      }
      aria-disabled={pending}
    >
      Log In <BsArrowRight className='ml-auto h-5 w-5 text-gray-50' />
    </button>
  )
}