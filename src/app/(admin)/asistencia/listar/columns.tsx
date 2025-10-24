"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

export type Asistencia = {
  id_asistencia: string;
  fecha_asistencia: Date;
  hora_asistencia: Date;
  activo: boolean;
  createdAt: Date;
  inscripcion: {
    numero_documento: string;
    nombres: string;
    apellidos: string;
    correo: string;
    plan: string;
  };
  evento: {
    denominacion: string;
    fecha_evento: Date;
  };
  registrado_por: {
    name: string;
    correo: string;
  };
};

export const columns: ColumnDef<Asistencia>[] = [
  {
    accessorKey: "inscripcion.nombres",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Participante" />
    ),
    cell: ({ row }) => {
      const { nombres, apellidos } = row.original.inscripcion;
      return (
        <div className="font-medium">
          {nombres} {apellidos}
        </div>
      );
    },
  },
  {
    accessorKey: "inscripcion.numero_documento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="N° Documento" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-mono">
          {row.original.inscripcion.numero_documento}
        </div>
      );
    },
  },
  {
    accessorKey: "evento.denominacion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Evento" />
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-xs truncate">
          {row.original.evento.denominacion}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Día" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return (
        <div className="text-sm">
          {new Date(date).toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "hora_asistencia",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hora Registro" />
    ),
    cell: ({ row }) => {
      const hora = row.getValue("hora_asistencia") as Date;
      return (
        <div className="font-mono text-sm">
          {new Date(hora).toLocaleTimeString("es-PE", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "registrado_por.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Registrado por" />
    ),
    cell: ({ row }) => {
      return <div className="text-sm">{row.original.registrado_por.name}</div>;
    },
  },
];
