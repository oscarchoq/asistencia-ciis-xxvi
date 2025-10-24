"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { EventoActions } from "./ui/EventoActions";

export type Evento = {
  id_evento: string;
  denominacion: string;
  descripcion: string | null;
  fecha_evento: Date;
  hora_inicio: Date;
  hora_fin: Date;
  activo: boolean;
  createdAt: Date;
};

export const columns: ColumnDef<Evento>[] = [
  {
    accessorKey: "denominacion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Denominación" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("denominacion")}</div>;
    },
  },
  {
    accessorKey: "descripcion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descripción" />
    ),
    cell: ({ row }) => {
      const descripcion = row.getValue("descripcion") as string | null;
      return (
        <div className="text-sm max-w-md truncate">
          {descripcion || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "fecha_evento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("fecha_evento") as Date;
      return (
        <div className="text-sm">
          {new Date(date).toLocaleDateString("es-PE", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "hora_inicio",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hora Inicio" />
    ),
    cell: ({ row }) => {
      const time = row.getValue("hora_inicio") as Date;
      return (
        <div className="text-sm">
          {new Date(time).toLocaleTimeString("es-PE", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "hora_fin",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hora Fin" />
    ),
    cell: ({ row }) => {
      const time = row.getValue("hora_fin") as Date;
      return (
        <div className="text-sm">
          {new Date(time).toLocaleTimeString("es-PE", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "activo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const activo = row.getValue("activo") as boolean;
      return (
        <Badge variant={activo ? "default" : "secondary"}>
          {activo ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <EventoActions evento={row.original} />,
  },
];
