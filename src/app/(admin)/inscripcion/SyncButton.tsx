"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

export function SyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // TODO: Implementar la lógica de sincronización
      console.log("Sincronizando datos...");
      
      // Simular una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Aquí irá tu lógica de sincronización real
      // const response = await syncInscripciones();
      
      console.log("Sincronización completada");
    } catch (error) {
      console.error("Error al sincronizar:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
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
  );
}
