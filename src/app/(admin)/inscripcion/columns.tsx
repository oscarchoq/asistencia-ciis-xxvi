"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
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
  virtual: "Virtual",
  presencial: "Presencial",
};

export const columns: ColumnDef<Inscripcion>[] = [
  {
    accessorKey: "numero_documento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="N° Documento" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("numero_documento")}</div>
    ),
  },
  {
    accessorKey: "correo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Correo" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[150px]">{row.getValue("correo")}</div>
    ),
  },
  {
    accessorKey: "nombres",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombres" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[150px]">{row.getValue("nombres")}</div>
    ),
  },
  {
    accessorKey: "apellidos",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Apellidos" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[150px]">{row.getValue("apellidos")}</div>
    ),
  },
  {
    accessorKey: "plan",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plan" />
    ),
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Método Pago" />
    ),
    cell: ({ row }) => {
      const metodo = row.getValue("metodo_pago") as PaymentMethod;
      return <span className="text-sm">{paymentMethodLabels[metodo]}</span>;
    },
  },
  {
    accessorKey: "tipo_inscripcion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => {
      const tipo = row.getValue("tipo_inscripcion") as InscriptionType;
      return (
        <Badge variant={tipo === "presencial" ? "default" : "secondary"}>
          {inscriptionTypeLabels[tipo]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "pago_validado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado Pago" />
    ),
    cell: ({ row }) => {
      const validado = row.getValue("pago_validado") as boolean;
      return (
        <Badge variant={validado ? "default" : "destructive"}>
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
  {
    accessorKey: "email_enviado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email Enviado" />
    ),
    cell: ({ row }) => {
      const enviado = row.getValue("email_enviado") as boolean;
      return (
        <Badge variant={enviado ? "default" : "secondary"}>
          {enviado ? "Enviado" : "No Enviado"}
        </Badge>
      );
    },
  },
];
