"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Inscripcion, PlanType, PaymentMethod, InscriptionType } from "@prisma/client";
import { MoreHorizontal, Pencil, CheckCircle, XCircle, Receipt, FileText } from "lucide-react";

// Mapeo de tipos de plan
const planTypeLabels: Record<PlanType, string> = {
  profesionales: "Profesionales",
  estudiantes: "Estudiantes",
  delegaciones: "Delegaciones",
  docenteesis: "Docente ESIS",
  estudianteesis: "Estudiante ESIS",
};

// Mapeo de métodos de pago
const paymentMethodLabels: Record<PaymentMethod, string> = {
  yape: "Yape",
  bcp: "BCP",
  efectivo: "Efectivo",
  otros: "Otros",
};

// Mapeo de tipos de inscripción
const inscriptionTypeLabels: Record<InscriptionType, string> = {
  virtual: "Virtual",
  presencial: "Presencial",
};

export const columns: ColumnDef<Inscripcion>[] = [
  {
    accessorKey: "numero_documento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="N° Documento" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("numero_documento")}</div>
    ),
  },
  {
    accessorKey: "nombres",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombres" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[150px]">{row.getValue("nombres")}</div>
    ),
  },
  {
    accessorKey: "apellidos",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Apellidos" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[150px]">{row.getValue("apellidos")}</div>
    ),
  },
  {
    accessorKey: "plan",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plan" />
    ),
    cell: ({ row }) => {
      const plan = row.getValue("plan") as PlanType;
      return <Badge variant="outline">{planTypeLabels[plan]}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "metodo_pago",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Método Pago" />
    ),
    cell: ({ row }) => {
      const metodo = row.getValue("metodo_pago") as PaymentMethod;
      return <span className="text-sm">{paymentMethodLabels[metodo]}</span>;
    },
  },
  {
    accessorKey: "tipo_inscripcion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => {
      const tipo = row.getValue("tipo_inscripcion") as InscriptionType;
      return (
        <Badge variant={tipo === "presencial" ? "default" : "secondary"}>
          {inscriptionTypeLabels[tipo]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "pago_validado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado Pago" />
    ),
    cell: ({ row }) => {
      const validado = row.getValue("pago_validado") as boolean;
      return (
        <Badge variant={validado ? "default" : "destructive"}>
          {validado ? "Validado" : "Pendiente"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      if (value === "TODOS") return true;
      const validado = row.getValue(id) as boolean;
      return value === "VALIDADO" ? validado : !validado;
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const inscripcion = row.original;
      const pagoValidado = inscripcion.pago_validado;

      return (
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
            <DropdownMenuItem
              onClick={() => {
                // TODO: Implementar edición
                console.log("Editar inscripción:", inscripcion.id_inscripcion);
              }}
            >
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
                // TODO: Implementar ver voucher
                if (inscripcion.link_voucher) {
                  window.open(inscripcion.link_voucher, "_blank");
                } else {
                  console.log("No hay voucher disponible");
                }
              }}
              disabled={!inscripcion.link_voucher}
            >
              <Receipt className="mr-2 h-4 w-4" />
              Ver Voucher
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                // TODO: Implementar ver matrícula
                if (inscripcion.link_matricula) {
                  window.open(inscripcion.link_matricula, "_blank");
                } else {
                  console.log("No hay matrícula disponible");
                }
              }}
              disabled={!inscripcion.link_matricula}
            >
              <FileText className="mr-2 h-4 w-4" />
              Ver Matrícula
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
