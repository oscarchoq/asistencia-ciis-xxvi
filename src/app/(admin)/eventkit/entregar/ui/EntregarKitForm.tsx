"use client";

import { useState } from "react";
import { QrCodeIcon } from "lucide-react";
import { entregarKit } from "@/actions";
import Swal from "sweetalert2";
import { QRScanner } from "./QRScanner";
import { encryptBase64 } from "@/lib/base64-util";

export default function EntregarKitForm() {
  const [showScanner, setShowScanner] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Función para entregar kit (usada por ambos métodos)
  const handleEntregarKit = async (numeroDocumento: string) => {
    if (!numeroDocumento.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Código requerido",
        text: "Por favor ingrese un código válido",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    setIsLoading(true);

    // Mostrar indicador de procesamiento
    Swal.fire({
      title: "Procesando...",
      html: "Entregando kit",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const result = await entregarKit(numeroDocumento);
      
      if (result.ok) {
        await Swal.fire({
          icon: "success",
          title: "¡Kit Entregado!",
          html: `<p class="text-lg">${result.message}</p>`,
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#10b981",
        });
        setManualCode(""); // Limpiar el input manual
      } else {
        await Swal.fire({
          icon: "error",
          title: "No se pudo entregar",
          html: `<p class="text-base">${result.message}</p>`,
          confirmButtonText: "Entendido",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error del sistema",
        text: "Ocurrió un error al entregar el kit. Por favor, intente nuevamente.",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#ef4444",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Callback cuando se escanea un QR - entrega automáticamente
  const handleQRScanned = async (code: string) => {
    console.log("QR Escaneado:", code); // Debug
    setShowScanner(false);
    await handleEntregarKit(code);
  };

  // Handler para el registro manual
  const handleManualSubmit = async () => {
    // Encriptar el código manual antes de enviar
    const codigoEncriptado = encryptBase64(manualCode.trim());
    await handleEntregarKit(codigoEncriptado);
  };

  // Handler para abrir el escáner QR
  const handleOpenScanner = () => {
    setManualCode(""); // Limpiar el input manual
    setShowScanner(true);
  };

  // Handler para cerrar el escáner QR
  const handleCloseScanner = () => {
    setShowScanner(false);
  };

  return (
    <div className="max-w-4xl w-full mx-auto">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        {/* Sección de Escanear QR / Cámara */}
        {!showScanner ? (
          <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed border-[#dadbdd] p-8 text-center dark:border-neutral-700">
            <span className="text-6xl text-[#6e7277] dark:text-neutral-400">
              <QrCodeIcon size={50} />
            </span>
            <div className="flex flex-col items-center gap-1">
              <p className="text-lg font-bold leading-tight tracking-[-0.015em] text-[#141415] dark:text-neutral-50">
                Escanear Código QR
              </p>
              <p className="max-w-xs text-sm font-normal leading-normal text-[#6e7277] dark:text-neutral-400">
                Coloque el código QR frente a la cámara para entregar el kit automáticamente.
              </p>
            </div>
            <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row">
              <button
                onClick={handleOpenScanner}
                disabled={isLoading}
                className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-4 text-sm font-bold leading-normal tracking-[0.015em] text-neutral-50 transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="truncate">Escanear QR</span>
              </button>
            </div>
          </div>
        ) : (
          <QRScanner
            onClose={handleCloseScanner}
            onScanned={handleQRScanned}
          />
        )}

        {/* Sección de Ingreso Manual */}
        <div className={`flex flex-col justify-center gap-4 transition-opacity ${showScanner ? 'opacity-50' : 'opacity-100'}`}>
          <p className="text-lg font-bold leading-tight tracking-[-0.015em] text-[#141415] dark:text-neutral-50">
            O ingrese manualmente
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              className="form-input h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-[#dadbdd] bg-white p-[15px] text-base font-normal leading-normal text-[#141415] placeholder:text-[#6e7277] focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus:border-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Ingrese su número de documento"
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading && !showScanner) {
                  handleManualSubmit();
                }
              }}
              disabled={isLoading || showScanner}
            />
            <button
              onClick={handleManualSubmit}
              disabled={isLoading || !manualCode.trim() || showScanner}
              className="flex h-14 min-w-[84px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-5 text-base font-bold leading-normal tracking-[0.015em] text-neutral-50 transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="truncate">
                {isLoading ? "Entregando..." : "Entregar Kit"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
