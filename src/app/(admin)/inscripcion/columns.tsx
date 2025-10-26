"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  Inscripcion,
  PlanType,
  PaymentMethod,
  InscriptionType,
} from "@prisma/client";
import { InscripcionActions } from "./ui/InscripcionActions";

// Mapeo de tipos de plan
const planTypeLabels: Record<PlanType, string> = {
  profesionales: "Profesionales",
  estudiantes: "Estudiantes",
  delegaciones: "Delegaciones",
  docenteesis: "Docente ESIS",
  estudianteesis: "Estudiante ESIS",
};

// Mapeo de métodos de pago
const paymentMethodLabels: Record<PaymentMethod, string> = {
  yape: "Yape",
  bcp: "BCP",
  efectivo: "Efectivo",
  otros: "Otros",
};

// Mapeo de tipos de inscripción
const inscriptionTypeLabels: Record<InscriptionType, string> = {
  virtual: "Formulario",
  presencial: "Presencial",
};

export const columns: ColumnDef<Inscripcion>[] = [
  {
    accessorKey: "numero_documento",
    header: "N° Documento",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("numero_documento")}</div>
    ),
  },
  // {
  //   accessorKey: "correo",
  //   header: "Correo",
  //   cell: ({ row }) => (
  //     <div className="min-w-[150px]">{row.getValue("correo")}</div>
  //   ),
  // },
  {
    accessorKey: "nombres",
    header: "Nombres",
    cell: ({ row }) => (
      <div className="min-w-[150px]">{row.getValue("nombres")}</div>
    ),
  },
  {
    accessorKey: "apellidos",
    header: "Apellidos",
    cell: ({ row }) => (
      <div className="min-w-[150px]">{row.getValue("apellidos")}</div>
    ),
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => {
      const plan = row.getValue("plan") as PlanType;
      return <Badge variant="outline">{planTypeLabels[plan]}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "metodo_pago",
    header: "Método Pago",
    cell: ({ row }) => {
      const metodo = row.getValue("metodo_pago") as PaymentMethod;
      return <Badge variant="outline">{paymentMethodLabels[metodo]}</Badge>
    },
  },
  {
    accessorKey: "tipo_inscripcion",
    header: "Tipo Inscripción",
    cell: ({ row }) => {
      const tipo = row.getValue("tipo_inscripcion") as InscriptionType;
      return (
        <Badge variant={tipo === "presencial" ? "presencial" : "formulario"}>
          {inscriptionTypeLabels[tipo]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "pago_validado",
    header: "Estado Pago",
    cell: ({ row }) => {
      const validado = row.getValue("pago_validado") as boolean;
      return (
        <Badge variant={validado ? "validado" : "pendiente"}>
          {validado ? "Validado" : "Pendiente"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      if (value === "TODOS") return true;
      const validado = row.getValue(id) as boolean;
      return value === "VALIDADO" ? validado : !validado;
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const inscripcion = row.original;
      return <InscripcionActions inscripcion={inscripcion} />;
    },
  },
  // {
  //   accessorKey: "email_enviado",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Email Enviado" />
  //   ),
  //   cell: ({ row }) => {
  //     const enviado = row.getValue("email_enviado") as boolean;
  //     return (
  //       <Badge variant={enviado ? "default" : "secondary"}>
  //         {enviado ? "Enviado" : "No Enviado"}
  //       </Badge>
  //     );
  //   },
  // },
];
