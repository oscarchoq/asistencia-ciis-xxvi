"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Inscripcion, PlanType } from "@prisma/client";
import { MoreHorizontal, Pencil, CheckCircle, XCircle, Receipt, FileText } from "lucide-react";
import { EditInscripcion } from "./EditInscripcion";
import { togglePaymentStatus } from "@/actions";
import { toast } from "sonner";
import { ImageViewer } from "@/components/ui/image-viewer";

// Mapeo de tipos de plan
const planTypeLabels: Record<PlanType, string> = {
  profesionales: "Profesionales",
  estudiantes: "Estudiantes",
  delegaciones: "Delegaciones",
  docenteesis: "Docente ESIS",
  estudianteesis: "Estudiante ESIS",
};

interface InscripcionActionsProps {
  inscripcion: Inscripcion;
}

export function InscripcionActions({ inscripcion }: InscripcionActionsProps) {
  const router = useRouter();
  const [openEdit, setOpenEdit] = useState(false);
  const [openAlertPayment, setOpenAlertPayment] = useState(false);
  const [openVoucherViewer, setOpenVoucherViewer] = useState(false);
  const [openMatriculaViewer, setOpenMatriculaViewer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pagoValidado = inscripcion.pago_validado;

  const handleTogglePayment = async () => {
    setIsLoading(true);
    toast.loading("Actualizando estado de pago...");

    try {
      const result = await togglePaymentStatus(inscripcion.id_inscripcion);

      toast.dismiss();

      if (result.ok) {
        toast.success(result.message || "Estado de pago actualizado");
        setOpenAlertPayment(false);
        router.refresh();
      } else {
        toast.error(result.error || "Error al actualizar el estado de pago");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error:", error);
      toast.error("Error inesperado al actualizar el estado de pago");
    } finally {
      setIsLoading(false);
    }
  };

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
              setOpenAlertPayment(true);
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
                setOpenVoucherViewer(true);
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
                setOpenMatriculaViewer(true);
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

      <AlertDialog open={openAlertPayment} onOpenChange={setOpenAlertPayment}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pagoValidado ? "¿Marcar pago como pendiente?" : "¿Validar pago?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pagoValidado
                ? `Estás a punto de marcar el pago de ${inscripcion.nombres} ${inscripcion.apellidos} como pendiente. Esta acción se puede revertir.`
                : `Estás a punto de validar el pago de ${inscripcion.nombres} ${inscripcion.apellidos}. Esta acción se puede revertir.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleTogglePayment();
              }}
              disabled={isLoading}
            >
              {isLoading ? "Procesando..." : "Continuar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {inscripcion.link_voucher && (
        <ImageViewer
          imageUrl={inscripcion.link_voucher}
          title={`Voucher - ${inscripcion.nombres} ${inscripcion.apellidos}`}
          open={openVoucherViewer}
          onOpenChange={setOpenVoucherViewer}
          type="voucher"
          inscripcionData={{
            id_inscripcion: inscripcion.id_inscripcion,
            nombres: inscripcion.nombres,
            apellidos: inscripcion.apellidos,
            plan: planTypeLabels[inscripcion.plan],
            pago_validado: inscripcion.pago_validado,
          }}
          onPaymentValidated={() => router.refresh()}
        />
      )}

      {inscripcion.link_matricula && (
        <ImageViewer
          imageUrl={inscripcion.link_matricula}
          title={`Matrícula - ${inscripcion.nombres} ${inscripcion.apellidos}`}
          open={openMatriculaViewer}
          onOpenChange={setOpenMatriculaViewer}
          type="matricula"
        />
      )}
    </>
  );
}
