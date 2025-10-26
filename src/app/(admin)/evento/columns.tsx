"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
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
    header: "Denominación",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("denominacion")}</div>;
    },
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
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
    header: "Fecha",
    cell: ({ row }) => {
      const date = row.getValue("fecha_evento") as Date;
      // Convertir a string YYYY-MM-DD sin cambios de zona horaria
      const dateString = new Date(date).toISOString().split('T')[0];
      const [year, month, day] = dateString.split('-');
      const localDate = new Date(Number(year), Number(month) - 1, Number(day));
      
      return (
        <div className="text-sm">
          {localDate.toLocaleDateString("es-PE", {
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
    header: "Hora Inicio",
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
    header: "Hora Fin",
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
    header: "Estado",
    cell: ({ row }) => {
      const activo = row.getValue("activo") as boolean;
      return (
        <Badge variant={activo ? "validado" : "rechazado"}>
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
