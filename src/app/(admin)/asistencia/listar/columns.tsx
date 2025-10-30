"use client";

import { extractTimeLocal, formatDateLocal } from "@/lib/date-util";
import { ColumnDef } from "@tanstack/react-table";

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
    header: "Participante",
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
    header: "N° Documento",
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
    header: "Evento",
    cell: ({ row }) => {
      return (
        <div className="max-w-xs truncate">
          {row.original.evento.denominacion}
        </div>
      );
    },
  },
  {
    accessorKey: "fecha_asistencia",
    header: "Día",
    cell: ({ row }) => {
      const date = row.getValue("fecha_asistencia") as string | Date;
      return (
        <div className="text-sm">
          {formatDateLocal(date, 'short')}
        </div>
      );
    },
  },
  {
    accessorKey: "hora_asistencia",
    header: "Hora Registro",
    cell: ({ row }) => {
      const hora = row.getValue("hora_asistencia") as string | Date;
      return (
        <div className="text-sm">
          {extractTimeLocal(hora)}
        </div>
      );
    },
  },
  {
    accessorKey: "registrado_por.name",
    header: "Registrado por",
    cell: ({ row }) => {
      return <div className="text-sm">{row.original.registrado_por.name}</div>;
    },
  },
];
