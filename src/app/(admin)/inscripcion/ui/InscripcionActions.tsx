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
import { MoreHorizontal, Pencil, CheckCircle, Receipt, FileText, Mail } from "lucide-react";
import { EditInscripcion } from "./EditInscripcion";
import { togglePaymentStatus, sendEmailInscripcionIndividual } from "@/actions";
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
  const [openAlertResendEmail, setOpenAlertResendEmail] = useState(false);
  const [openVoucherViewer, setOpenVoucherViewer] = useState(false);
  const [openMatriculaViewer, setOpenMatriculaViewer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const pagoValidado = inscripcion.pago_validado;

  const handleTogglePayment = async () => {
    setIsLoading(true);
    toast.loading("Validando pago y enviando correo...");

    try {
      const result = await togglePaymentStatus(inscripcion.id_inscripcion);

      toast.dismiss();

      if (result.ok) {
        if (result.warning) {
          toast.warning(result.message || "Pago validado con advertencias");
        } else {
          toast.success(result.message || "Pago validado exitosamente");
        }
        setOpenAlertPayment(false);
        router.refresh();
      } else {
        toast.error(result.error || "Error al validar el pago");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error:", error);
      toast.error("Error inesperado al validar el pago");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    // Validar que el pago esté validado antes de reenviar
    if (!inscripcion.pago_validado) {
      toast.error("El pago no ha sido validado aún");
      return;
    }

    setIsResending(true);
    toast.loading("Reenviando correo de confirmación...");

    try {
      const result = await sendEmailInscripcionIndividual(inscripcion, false);

      toast.dismiss();

      if (result.ok) {
        toast.success(result.message || "Correo reenviado exitosamente");
        setOpenAlertResendEmail(false);
      } else {
        toast.error(result.message || "Error al reenviar el correo");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error:", error);
      toast.error("Error inesperado al reenviar el correo");
    } finally {
      setIsResending(false);
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
            disabled={pagoValidado}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {pagoValidado ? "Pago Validado" : "Validar Pago"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setOpenAlertResendEmail(true);
            }}
            disabled={!pagoValidado}
          >
            <Mail className="mr-2 h-4 w-4" />
            Reenviar Correo
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
            <AlertDialogTitle>¿Deseas validar el pago?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de validar el pago de {inscripcion.nombres}{" "}
              {inscripcion.apellidos}.
              Una vez confirmado, se enviará automáticamente un correo de confirmación con el código QR.
              Esta acción es definitiva y no puede deshacerse.
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
              {isLoading ? "Validando y enviando..." : "Validar y Enviar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openAlertResendEmail} onOpenChange={setOpenAlertResendEmail}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Reenviar correo de confirmación?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de reenviar el correo de confirmación con el código QR a{" "}
              <span className="font-semibold">{inscripcion.correo}</span> para{" "}
              {inscripcion.nombres} {inscripcion.apellidos}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isResending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleResendEmail();
              }}
              disabled={isResending}
            >
              {isResending ? "Enviando..." : "Reenviar Correo"}
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
