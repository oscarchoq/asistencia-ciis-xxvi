"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Home,
  ClipboardCheck,
  Package,
  UserPlus,
  Users,
  Calendar,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSession } from 'next-auth/react'

// This is sample data.
const navMainData = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Asistencia",
    url: "/asistencia",
    icon: ClipboardCheck,
    items: [
      {
        title: "Asistencias marcadas",
        url: "/asistencia/listar",
      },
      {
        title: "Marcar asistencia",
        url: "/asistencia/marcar",
      },
    ],
  },
  {
    title: "Kits",
    url: "/eventkit",
    icon: Package,
    items: [
      {
        title: "Kits entregados",
        url: "/eventkit/listar",
      },
      {
        title: "Entregar Kit",
        url: "/eventkit/entregar",
      },
    ],
  },
  {
    title: "Inscripcion",
    url: "/inscripcion",
    icon: UserPlus,
  },
  {
    title: "Eventos",
    url: "/evento",
    icon: Calendar,
  },
  {
    title: "Usuarios",
    url: "/usuario",
    icon: Users,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { data: session} = useSession()

  // Marcar como activo el item que coincida con la ruta actual
  const navMainWithActive = navMainData.map((item) => ({
    ...item,
    isActive: pathname === item.url,
  }))

  // Datos del usuario
  console.log(session)

  const userData = {
  name: session?.user.name || 'Invitado',
  email: session?.user.correo || '',
  avatar: "https://img.freepik.com/psd-gratis/3d-ilustracion-persona-gafas_23-2149436190.jpg",
}

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <Image
                  src="https://img.freepik.com/vector-gratis/silueta-ave-fenix-diseno-plano_23-2150499724.jpg"
                  alt="CIIS"
                  width={25}
                  height={25}
                  className="!size-5"
                />
                <span className="text-base font-semibold">CIIS TACNA</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithActive} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
