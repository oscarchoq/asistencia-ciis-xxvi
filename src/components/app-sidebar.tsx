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
import { filterMenuByRole } from "@/lib/auth-utils"
import type { RoleType } from "@/interfaces/enums"

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
  const { data: session, status } = useSession()

  // Si la sesión está cargando, mostrar skeleton mínimo
  if (status === 'loading') {
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
          {/* Loading skeleton - más discreto */}
          <div className="px-3 py-2 space-y-1">
            <div className="h-9 bg-sidebar-accent/50 rounded-md animate-pulse" />
          </div>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    )
  }

  // Si no hay sesión, redirigir (esto no debería pasar por el layout)
  if (!session?.user) {
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
          <NavMain items={[{
            title: "Home",
            url: "/",
            icon: Home,
            isActive: pathname === '/',
          }]} />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    )
  }

  // Obtener permisos del usuario (ahora sin fallback)
  const userRole = session.user.role as RoleType
  const permissions = filterMenuByRole(userRole)

  // Filtrar el menú según los permisos del usuario
  const filteredNavData = navMainData.filter((item) => {
    if (item.url === '/') return permissions.home
    if (item.url === '/asistencia') return permissions.asistencia
    if (item.url === '/eventkit') return permissions.eventkit
    if (item.url === '/inscripcion') return permissions.inscripcion
    if (item.url === '/evento') return permissions.evento
    if (item.url === '/usuario') return permissions.usuario
    return false
  })

  // Marcar como activo el item que coincida con la ruta actual
  const navMainWithActive = filteredNavData.map((item) => ({
    ...item,
    isActive: pathname === item.url,
  }))

  // Datos del usuario
  const userData = {
    name: session.user.name || 'Usuario',
    email: session.user.correo || '',
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
