import bcryptjs from 'bcryptjs';
import { PaymentMethodType, PlanType, RoleType } from '../interfaces/enums';

interface Usuario {
  correo: string;
  password: string;
  name: string;
  role: RoleType;
}

interface Inscripcion {
  correo_formulario: string;
  correo: string;
  nombres: string;
  apellidos: string;
  numero_documento: string;
  celular: string;
  plan: PlanType;
  metodo_pago: PaymentMethodType;
  link_voucher?: string;
  link_matricula?: string;
}

interface SeedData {
  users: Usuario[];
  inscripciones: Inscripcion[];
}


export const initialData: SeedData = {
  users: [
    {
      correo: 'ciis@google.com',
      password: bcryptjs.hashSync('admin123'),
      name: 'Administrador User',
      role: 'administrador',
    },
    {
      correo: 'organizador@google.com',
      password: bcryptjs.hashSync('admin123'),
      name: 'Organizador User',
      role: 'organizador',
    },
    {
      correo: 'asistencia@google.com',
      password: bcryptjs.hashSync('admin123'),
      name: 'Asistencia User',
      role: 'asistencia',
    },
    {
      correo: 'kits@google.com',
      password: bcryptjs.hashSync('admin123'),
      name: 'Kits User',
      role: 'kits',
    },
    {
      correo: 'recepcion@google.com',
      password: bcryptjs.hashSync('admin123'),
      name: 'Recepción User',
      role: 'recepcion',
    },
  ],
  inscripciones: [
    {
      correo_formulario: 'juan.perez@formulario.com',
      correo: 'lquispeq@unjbg.edu.pe',
      nombres: 'Luz Luz',
      apellidos: 'Pérez García',
      numero_documento: '72345678',
      celular: '987654321',
      plan: 'estudiantes',
      metodo_pago: 'yape',
      link_voucher: "https://drive.google.com/file/d/1TiQ4o3U4q4QVPGCs7LNDWc3O2rHSh4a6/view?usp=sharing"
    },
    {
      correo_formulario: 'maria.lopez@formulario.com',
      correo: 'eypaniaguam@unjbg.edu.pe',
      nombres: 'Elian Fernanda',
      apellidos: 'López Rodríguez',
      numero_documento: '71234567',
      celular: '965432187',
      plan: 'profesionales',
      metodo_pago: 'bcp',
    },
    {
      correo_formulario: 'carlos.sanchez@formulario.com',
      correo: 'oachoques@unjbg.edu.pe',
      nombres: 'Oscar Alberto',
      apellidos: 'Sánchez Vega',
      numero_documento: '70987654',
      celular: '998765432',
      plan: 'delegaciones',
      metodo_pago: 'efectivo',
    },
    {
      correo_formulario: 'ana.torres@formulario.com',
      correo: 'lquispeq@unjbg.edu.pe',
      nombres: 'Ana Luz',
      apellidos: 'Torres Mendoza',
      numero_documento: '73456789',
      celular: '954321876',
      plan: 'estudianteesis',
      metodo_pago: 'yape',
      link_voucher: "https://drive.google.com/file/d/1TiQ4o3U4q4QVPGCs7LNDWc3O2rHSh4a6/view?usp=sharing",
      link_matricula: "https://drive.google.com/file/d/1wNLOhFPGIXQ9MFOe9Y1yUM_y-7D3CTJI/view"
    },
    {
      correo_formulario: 'roberto.diaz@formulario.com',
      correo: 'eypaniaguam@unjbg.edu.pe',
      nombres: 'Roberto Elian',
      apellidos: 'Díaz Flores',
      numero_documento: '74567890',
      celular: '976543210',
      plan: 'docenteesis',
      metodo_pago: 'otros',
    },
  ],
}