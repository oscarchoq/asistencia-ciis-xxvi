"use client";

import { ColumnDef } from "@tanstack/react-table";

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
      const fecha = row.getValue("fecha_entrega") as Date;
      // Evitar problema de zona horaria
      const dateString = new Date(fecha).toISOString().split('T')[0];
      const [year, month, day] = dateString.split('-');
      const localDate = new Date(Number(year), Number(month) - 1, Number(day));
      
      return (
        <span>
          {localDate.toLocaleDateString("es-PE", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Hora Entrega",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as Date;
      return (
        <span className="text-sm text-muted-foreground">
          {new Date(createdAt).toLocaleTimeString("es-PE", {
            hour: "2-digit",
            minute: "2-digit",
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
