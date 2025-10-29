"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatDateLocal, extractTimeLocal } from "@/lib/date-util";

type Kit = {
  id_kit: string;
  entregado: boolean;
  fecha_entrega: Date;
  createdAt: Date;
  inscripcion: {
    nombres: string;
    apellidos: string;
    numero_documento: string;
  };
  entregado_por: {
    name: string;
  };
};

export const columns: ColumnDef<Kit>[] = [
  {
    accessorKey: "inscripcion.nombres",
    header: "Participante",
    cell: ({ row }) => {
      const nombres = row.original.inscripcion.nombres;
      const apellidos = row.original.inscripcion.apellidos;
      return (
        <div className="font-medium">
          {nombres} {apellidos}
        </div>
      );
    },
  },
  {
    accessorKey: "inscripcion.numero_documento",
    header: "N° Documento",
  },
  {
    accessorKey: "fecha_entrega",
    header: "Fecha Entrega",
    cell: ({ row }) => {
      const fecha = row.getValue("fecha_entrega") as string | Date;
      return (
        <span>
          {formatDateLocal(fecha, 'short')}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Hora Entrega",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string | Date;
      return (
        <span className="text-sm text-muted-foreground">
          {extractTimeLocal(createdAt)}
        </span>
      );
    },
  },
  {
    accessorKey: "entregado_por",
    header: "Entregado por",
    cell: ({ row }) => {
      const usuario = row.original.entregado_por;
      return (
        <span className="text-muted-foreground">
          {usuario.name}
        </span>
      );
    },
  },
];
