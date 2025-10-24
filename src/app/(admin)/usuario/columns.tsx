"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { UsuarioActions } from "./ui/UsuarioActions";

export type Usuario = {
  id_usuario: string;
  correo: string;
  name: string;
  role: "administrador" | "organizador" | "asistencia";
  activo: boolean;
  createdAt: Date;
};

const roleLabels: Record<string, string> = {
  administrador: "Administrador",
  organizador: "Organizador",
  asistencia: "Asistencia",
};

const roleVariants: Record<string, "default" | "secondary" | "outline"> = {
  administrador: "default",
  organizador: "secondary",
  asistencia: "outline",
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
        <Badge variant={roleVariants[role] || "default"}>
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
        <Badge variant={activo ? "default" : "secondary"}>
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
          {new Date(date).toLocaleDateString("es-PE")}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UsuarioActions usuario={row.original} />,
  },
];
