import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";
import { auth } from "@/auth.config";
// import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";
// import { toast } from "sonner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // Verificar sesión JWT
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  // Validar que usuario existe en BD
  // try {
  //   const user = await prisma.usuario.findUnique({
  //     where: { 
  //       id_usuario: session.user.id_usuario,
  //       activo: true 
  //     }
  //   });
    
  //   if (!user) {
  //     // Usuario NO existe o está inactivo → LOGIN

  //     toast.error("No autorizado - Usuario no encontrado o inactivo");
  //     redirect('/auth/login');
  //   }
  // } catch (error) {
  //   // Error de BD → Redirigir al login también
  //   console.warn("Error al validar usuario:", error);
  //   toast.error("No autorizado - Usuario no encontrado o inactivo");
  //   redirect('/auth/login');
  // }

  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <DynamicBreadcrumb />
            </div>
          </header>
          <main className="m-5 lg:mx-20 lg:my-5 flex-1 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
