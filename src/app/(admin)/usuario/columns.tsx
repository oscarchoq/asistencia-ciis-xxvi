"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { UsuarioActions } from "./ui/UsuarioActions";
import type { RoleType } from "@/interfaces";
import { formatDateLocal } from "@/lib/date-util";

export type Usuario = {
  id_usuario: string;
  correo: string;
  name: string;
  role: RoleType;
  activo: boolean;
  createdAt: Date;
};

const roleLabels: Record<string, string> = {
  administrador: "Administrador",
  organizador: "Organizador",
  asistencia: "Asistencia",
  kits: "Kits",
  recepcion: "Recepción",
};

export const columns: ColumnDef<Usuario>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "correo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Correo" />
    ),
    cell: ({ row }) => {
      return <div className="text-sm">{row.getValue("correo")}</div>;
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rol" />
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge variant={"outline"}>
          {roleLabels[role] || role}
        </Badge>
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
        <Badge variant={activo ? "info" : "rechazado"}>
          {activo ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha Creación" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;      
      return (
        <div className="text-sm">
          {formatDateLocal(date, 'short')}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UsuarioActions usuario={row.original} />,
  },
];
