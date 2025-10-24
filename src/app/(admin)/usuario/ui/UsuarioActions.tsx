"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditUsuario } from "./EditUsuario";

interface UsuarioActionsProps {
  usuario: {
    id_usuario: string;
    correo: string;
    name: string;
    role: "administrador" | "organizador" | "asistencia";
    activo: boolean;
  };
}

export function UsuarioActions({ usuario }: UsuarioActionsProps) {
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditUsuario
        usuario={usuario}
        open={openEdit}
        onOpenChange={setOpenEdit}
      />
    </>
  );
}
