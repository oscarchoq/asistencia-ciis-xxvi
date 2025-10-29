"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { EventoActions } from "./ui/EventoActions";
import { formatDateLocal, extractTimeLocal } from "@/lib/date-util";

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
      const date = row.getValue("fecha_evento") as Date | string;
      const fechaFormateada = formatDateLocal(date, 'long');
      
      // Obtener día de la semana manualmente
      const dateStr = typeof date === 'string' ? date : date.toISOString();
      const [year, month, day] = dateStr.split('T')[0].split('-');
      const localDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const diaSemana = diasSemana[localDate.getDay()];
      
      return (
        <div className="text-sm">
          {diaSemana}, {fechaFormateada}
        </div>
      );
    },
  },
  {
    accessorKey: "hora_inicio",
    header: "Hora Inicio",
    cell: ({ row }) => {
      const time = row.getValue("hora_inicio") as Date | string;
      return (
        <div className="text-sm">
          {extractTimeLocal(time)}
        </div>
      );
    },
  },
  {
    accessorKey: "hora_fin",
    header: "Hora Fin",
    cell: ({ row }) => {
      const time = row.getValue("hora_fin") as Date | string;
      return (
        <div className="text-sm">
          {extractTimeLocal(time)}
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
