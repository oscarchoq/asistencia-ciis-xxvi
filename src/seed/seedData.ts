interface SeedData {
  metodoPago: string[];
  plan: string[];
  rol: string[];
}

export const initialData: SeedData = {
  metodoPago: [
    "EFECTIVO",
    "YAPE",
    "BCP",
  ],
  plan: [
    "PROFESIONALES",
    "ESTUDIANTES",
    "DELEGACIONES",
    "DOCENTE ESIS",
    "ESTUDIANTE ESIS",
  ],
  rol: [
    "ADMINISTRADOR",
    "ORGANIZADOR",
    "ASISTENCIA",
  ],
}