"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink } from "lucide-react";
import { togglePaymentStatus } from "@/actions";
import { toast } from "sonner";

interface ImageViewerProps {
  imageUrl: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: "voucher" | "matricula";
  inscripcionData?: {
    id_inscripcion: string;
    nombres: string;
    apellidos: string;
    plan: string;
    pago_validado: boolean;
  };
  onPaymentValidated?: () => void;
}

export function ImageViewer({ 
  imageUrl, 
  title, 
  open, 
  onOpenChange,
  type = "matricula",
  inscripcionData,
  onPaymentValidated
}: ImageViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [openAlertPayment, setOpenAlertPayment] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Convertir link de Google Drive al formato de preview embebible
  const getEmbedUrl = (url: string) => {
    if (!url) return url;
    
    if (url.includes('drive.google.com')) {
      // Intentar extraer el ID de diferentes formatos de URL de Drive
      let fileId = null;
      
      // Formato: /file/d/{id}/view o /d/{id}
      const matchD = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (matchD && matchD[1]) {
        fileId = matchD[1];
      }
      
      // Formato: /file/d/{id}
      const matchFile = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (matchFile && matchFile[1]) {
        fileId = matchFile[1];
      }
      
      // Formato: id={id}
      const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (matchId && matchId[1]) {
        fileId = matchId[1];
      }
      
      if (fileId) {
        // Usar el preview de Google Drive que incluye todas las herramientas
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
    
    return url;
  };

  const embedUrl = getEmbedUrl(imageUrl);

  // Reset estados cuando cambia la URL
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setIsLoading(true);
      setHasError(false);
    }
    onOpenChange(open);
  };

  const handleOpenInNewTab = () => {
    window.open(imageUrl, "_blank");
  };

  const handleTogglePayment = async () => {
    if (!inscripcionData) return;
    
    setIsValidating(true);
    toast.loading("Actualizando estado de pago...");

    try {
      const result = await togglePaymentStatus(inscripcionData.id_inscripcion);

      toast.dismiss();

      if (result.ok) {
        toast.success(result.message || "Estado de pago actualizado");
        setOpenAlertPayment(false);
        if (onPaymentValidated) {
          onPaymentValidated();
        }
      } else {
        toast.error(result.error || "Error al actualizar el estado de pago");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error:", error);
      toast.error("Error inesperado al actualizar el estado de pago");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
          <DialogHeader className="bg-zinc-300/50 -mx-6 -mt-6 px-6 pt-4 pb-4 mb-2 rounded-t-md">
            <DialogTitle>
              {type === "voucher" && inscripcionData ? (
                <div className="flex items-center justify-start gap-3">
                  {!inscripcionData.pago_validado && (
                    <Button
                      onClick={() => setOpenAlertPayment(true)}
                      size="sm"
                      variant="destructive"
                    >
                      Validar Pago
                    </Button>
                  )}
                  <Badge variant="outline" className="text-sm">
                    {inscripcionData.plan}
                  </Badge>
                </div>
              ) : (
                <div className="flex items-center justify-between pr-8">
                  <span className="text-lg font-semibold">{title}</span>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
        <div className="relative w-full h-[75vh] flex items-center justify-center bg-muted/20 rounded-lg overflow-hidden">
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/80">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Cargando visor de Drive...</p>
              </div>
            </div>
          )}
          {hasError ? (
            <div className="text-center p-8 space-y-4">
              <p className="text-muted-foreground mb-2">
                No se pudo cargar el visor de Google Drive
              </p>
              <p className="text-xs text-muted-foreground break-all">
                URL: {imageUrl}
              </p>
              <Button onClick={handleOpenInNewTab} variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                Abrir en Google Drive
              </Button>
            </div>
          ) : (
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              allow="autoplay"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                console.error('Error loading Google Drive viewer:', { imageUrl, embedUrl });
                setIsLoading(false);
                setHasError(true);
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>

    {type === "voucher" && inscripcionData && !inscripcionData.pago_validado && (
      <AlertDialog open={openAlertPayment} onOpenChange={setOpenAlertPayment}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Validar pago?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de validar el pago de {inscripcionData.nombres} {inscripcionData.apellidos}. Esta acción se puede revertir posteriormente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isValidating}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleTogglePayment();
              }}
              disabled={isValidating}
            >
              {isValidating ? "Validando..." : "Validar Pago"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )}
    </>
  );
}
