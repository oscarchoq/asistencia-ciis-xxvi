"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Mapeo de rutas a nombres legibles
const routeNames: Record<string, string> = {
  home: "Home",
  asistencia: "Asistencia",
  // listar: "Listar",
  registrar: "Registrar",
  eventKit: "Kits",
  inscripcion: "Inscripción",
  usuario: "Usuarios",
}

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  
  // Dividir el pathname en segmentos
  const segments = pathname.split("/").filter((segment) => segment !== "")
  
  // Generar breadcrumbs
  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    const name = routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
    const isLast = index === segments.length - 1
    
    return {
      name,
      href,
      isLast,
    }
  })

  if (pathname === "/" || segments.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb) => {
          const isLast = breadcrumb.isLast
          
          return (
            <div key={breadcrumb.href} className="contents">
              {/* En móvil: solo mostrar el último item (página actual) */}
              {/* En desktop: mostrar todos */}
              <BreadcrumbItem className={!isLast ? "hidden md:flex" : ""}>
                {isLast ? (
                  <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={breadcrumb.href}>{breadcrumb.name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator className="hidden md:block" />
              )}
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
