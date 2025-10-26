"use client";

import { ColumnDef } from "@tanstack/react-table";

type Kit = {
  id_kit: string;
  entregado: boolean;
  fecha_entrega: Date;
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
      const fecha = new Date(row.getValue("fecha_entrega"));
      return (
        <span>
          {fecha.toLocaleDateString("es-PE", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
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
