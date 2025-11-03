"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { syncInscripciones } from "@/actions";
import { useRouter } from "next/navigation";

export function SyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await syncInscripciones();

      if (result.ok) {
        if (result.rows > 0) { //Hubo registros sincronizados
          toast.success(`Sincronización exitosa: ${result.rows} registros nuevos.`);
          router.refresh();
        }
        else {
          toast.info("No hay nuevos registros para sincronizar.");
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error al sincronizar:", error);
      toast.error("Error interno al sincronizar");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleSync}
        disabled={isSyncing}
        className="gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
        {isSyncing ? "Sincronizando..." : "Sincronizar"}
      </Button>
    </div>
  );
}
