import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import type { RoleType } from "@/interfaces/enums";

/**
 * Verifica si el usuario tiene acceso al módulo especificado
 * Reglas:
 * - asistencia: solo puede acceder a /asistencia
 * - organizador: solo puede acceder a /eventkit e /inscripcion
 * - administrador: puede acceder a todo
 * - kits: permisos por definir
 * - recepcion: permisos por definir
 */
export async function checkModuleAccess(module: 'asistencia' | 'eventkit' | 'inscripcion' | 'evento' | 'usuario') {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  const userRole = session.user.role as RoleType;
  
  // Administrador tiene acceso a todo
  if (userRole === 'administrador') {
    return session.user;
  }

  // Validaciones específicas por rol
  switch (module) {
    case 'asistencia':
      if (userRole !== 'asistencia') {
        redirect('/');
      }
      break;
      
    case 'eventkit':
    case 'inscripcion':
      if (userRole !== 'organizador') {
        redirect('/');
      }
      break;
      
    case 'evento':
    case 'usuario':
      // Solo administrador puede acceder
      redirect('/');
      break;
  }

  return session.user;
}

/**
 * Filtra las opciones del menú según el rol del usuario
 */
export function filterMenuByRole(userRole: RoleType) {
  const allModules = {
    home: true,
    asistencia: false,
    eventkit: false,
    inscripcion: false,
    evento: false,
    usuario: false,
  };

  switch (userRole) {
    case 'administrador':
      // El administrador puede ver todo
      return {
        home: true,
        asistencia: true,
        eventkit: true,
        inscripcion: true,
        evento: true,
        usuario: true,
      };

    case 'asistencia':
      // Solo puede ver asistencia
      return {
        ...allModules,
        asistencia: true,
      };

    case 'organizador':
      // Solo puede ver eventkit e inscripcion
      return {
        ...allModules,
        eventkit: true,
        inscripcion: true,
      };

    case 'kits':
      // Permisos por definir - por ahora sin acceso
      return {
        ...allModules,
      };

    case 'recepcion':
      // Permisos por definir - por ahora sin acceso
      return {
        ...allModules,
      };

    default:
      return allModules;
  }
}
