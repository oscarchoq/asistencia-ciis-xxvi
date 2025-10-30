import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import prisma from "./lib/prisma";
import bcryptjs from 'bcryptjs';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 6 * 60 * 60, // 6 horas de session
  },
  callbacks: {

    // TODO: PARA PROTEGER RUTAS (FORMA CON MIDDLEWARE)
    // https://nextjs.org/learn/dashboard-app/adding-authentication
    // authorized({ auth, request: { nextUrl } }) {
    //   const isLoggedIn = !!auth?.user;
    //   const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
    //   if (isOnDashboard) {
    //     if (isLoggedIn) return true;
    //     return false; // Redirect unauthenticated users to login page
    //   } else if (isLoggedIn) {
    //     return Response.redirect(new URL('/dashboard', nextUrl));
    //   }
    //   return true;
    // },

    async jwt({ token, user }) {
      if (user) {
        token.data = user
      }
      
      // Validar que el usuario aún existe en la base de datos
      if (token.data && (token.data as { id_usuario: string }).id_usuario) {
        const userId = (token.data as { id_usuario: string }).id_usuario;
        const userExists = await prisma.usuario.findUnique({
          where: { 
            id_usuario: userId,
            activo: true 
          }
        });
        
        // Si el usuario no existe o no está activo, invalidar el token
        if (!userExists) {
          return null as never;
        }
      }
      
      return token
    },

    session({ session, token }) {

      session.user = token.data as never
      // console.log({ session, token, user })
      return session
    },

  },
  providers: [
    Credentials({
      async authorize(credentials) {

        console.log(`
          LLEGA A AUTHORIZE 
          `)

        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (!parsedCredentials.success) return null;
        const { email, password } = parsedCredentials.data
        console.log({email, password})

        // Buscar correo
        const user = await prisma.usuario.findUnique({
          where: { 
            correo: email.toLowerCase(),
            activo: true, 
          }
        })
        if (!user) return null;

        // comparar las contrasenas
        if (!bcryptjs.compareSync(password, user.password)) return null

        // regresar el usuario sin psw
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...rest } = user
        console.log({ rest })
        return rest;

      }
    })
  ],
}

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig)
// el handler permite hacer el GET POST