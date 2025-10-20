import bcryptjs from 'bcryptjs';

interface Usuario {
  correo: string;
  password: string;
  name: string;
  role: 'administrador' | 'organizador' | 'asistencia';
}

interface SeedData {
  metodoPago: string[];
  plan: string[];
  users: Usuario[];
}


export const initialData: SeedData = {
  users: [
    {
      correo: 'ciis@google.com',
      password: bcryptjs.hashSync('admin123'),
      name: 'Administrador',
      role: 'administrador',
    },
    {
      correo: 'organizador@google.com',
      password: bcryptjs.hashSync('admin123'),
      name: 'hola mundo',
      role: 'organizador',
    },
  ],
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
}