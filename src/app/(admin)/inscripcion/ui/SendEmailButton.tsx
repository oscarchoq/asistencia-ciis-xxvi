"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sendEmailInscripciones } from "@/actions/inscripcion/send-email-inscripcion";
import { Inscripcion } from "@prisma/client";
import { Mail, Loader2, Check } from "lucide-react";

interface SendEmailButtonProps {
  inscripciones: Inscripcion[];
}

export function SendEmailButton({ inscripciones }: SendEmailButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmails = async () => {
    setIsLoading(true);

    try {
      const response = await sendEmailInscripciones(inscripciones);

      if (response.ok) {
        // Mostrar resumen en toast
        toast.success(response.message, {
          description: response.data
            ? `${response.data.enviados} enviados correctamente. ${response.data.fallidos} fallidos.`
            : "",
          duration: 5000,
        });
      } else {
        toast.error("Error al enviar correos", {
          description: response.message,
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error al enviar correos:", error);
      toast.error("Error inesperado", {
        description: "Ocurrió un error al intentar enviar los correos",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Contar cuántos correos se pueden enviar
  const pendientesDeEnvio = inscripciones.filter(
    (i) => i.tipo_inscripcion === "virtual" && i.email_enviado === false
  ).length;

  const isDisabled = pendientesDeEnvio === 0 || isLoading;

  return (
    <Button
      onClick={handleSendEmails}
      disabled={isDisabled}
      variant={pendientesDeEnvio === 0 ? "outline" : "default"}
      size="sm"
      className="gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Enviando...
        </>
      ) : pendientesDeEnvio === 0 ? (
        <>
          <Check className="h-4 w-4" />
          Sin pendientes
        </>
      ) : (
        <>
          <Mail className="h-4 w-4" />
          Enviar {pendientesDeEnvio} correos
        </>
      )}
    </Button>
  );
}
