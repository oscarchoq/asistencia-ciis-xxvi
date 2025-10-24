"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Inscripcion } from "@prisma/client";
import { MoreHorizontal, Pencil, CheckCircle, XCircle, Receipt, FileText } from "lucide-react";
import { EditInscripcion } from "./EditInscripcion";

interface InscripcionActionsProps {
  inscripcion: Inscripcion;
}

export function InscripcionActions({ inscripcion }: InscripcionActionsProps) {
  const [openEdit, setOpenEdit] = useState(false);
  const pagoValidado = inscripcion.pago_validado;

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
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              // TODO: Implementar cambio de estado de pago
              console.log("Cambiar estado de pago:", inscripcion.id_inscripcion);
            }}
          >
            {pagoValidado ? (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Marcar como Pendiente
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Validar Pago
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              if (inscripcion.link_voucher) {
                window.open(inscripcion.link_voucher, "_blank");
              }
            }}
            disabled={!inscripcion.link_voucher}
          >
            <Receipt className="mr-2 h-4 w-4" />
            Ver Voucher
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (inscripcion.link_matricula) {
                window.open(inscripcion.link_matricula, "_blank");
              }
            }}
            disabled={!inscripcion.link_matricula}
          >
            <FileText className="mr-2 h-4 w-4" />
            Ver Matrícula
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditInscripcion
        inscripcion={inscripcion}
        open={openEdit}
        onOpenChange={setOpenEdit}
      />
    </>
  );
}
