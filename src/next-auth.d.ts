import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id_usuario: string
      correo: string
      name: string
      role: string
      activo: boolean
    } & DefaultSession["user"]
  }

  interface User {
    id_usuario: string
    correo: string
    name: string
    role: string
    activo: boolean
  }
}
