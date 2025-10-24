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
import { EditEvento } from "./EditEvento";

interface EventoActionsProps {
  evento: {
    id_evento: string;
    denominacion: string;
    descripcion: string | null;
    fecha_evento: Date;
    hora_inicio: Date;
    hora_fin: Date;
    activo: boolean;
  };
}

export function EventoActions({ evento }: EventoActionsProps) {
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

      <EditEvento evento={evento} open={openEdit} onOpenChange={setOpenEdit} />
    </>
  );
}
