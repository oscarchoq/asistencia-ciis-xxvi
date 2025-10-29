"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEvento } from "@/actions";
import { toast } from "sonner";
import { Plus } from "lucide-react";

type FormData = {
  denominacion: string;
  descripcion?: string;
  fecha_evento: string | Date;
  hora_inicio: string | Date;
  hora_fin: string | Date;
};

export function CreateEvento() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    // Validar que hora_fin sea mayor que hora_inicio
    if (data.hora_fin <= data.hora_inicio) {
      toast.error("La hora de fin debe ser mayor que la hora de inicio");
      setIsLoading(false);
      return;
    }
    
    toast.loading("Creando evento...");

    try {
      // Construir strings ISO en hora local (sin conversión de zona horaria)
      // Para fecha_evento: solo fecha sin hora
      const fecha_evento_iso = `${data.fecha_evento}T00:00:00.000Z`;
      
      // Para hora_inicio: fecha + hora especificada
      const hora_inicio_iso = `${data.fecha_evento}T${data.hora_inicio}:00.000Z`;
      
      // Para hora_fin: fecha + hora especificada
      const hora_fin_iso = `${data.fecha_evento}T${data.hora_fin}:00.000Z`;

      const result = await createEvento({
        denominacion: data.denominacion,
        descripcion: data.descripcion,
        fecha_evento: fecha_evento_iso,
        hora_inicio: hora_inicio_iso,
        hora_fin: hora_fin_iso,
      });

      toast.dismiss();

      if (result.ok) {
        toast.success(result.message || "Evento creado exitosamente");
        reset();
        setOpen(false);
        window.location.reload();
      } else {
        toast.error(result.error || "Error al crear evento");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error:", error);
      toast.error("Error inesperado al crear evento");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Evento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Evento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="denominacion">
              Denominación <span className="text-red-500">*</span>
            </Label>
            <Input
              id="denominacion"
              placeholder="Ej: Ceremonia de Inauguración"
              {...register("denominacion", {
                required: "La denominación es requerida",
                minLength: {
                  value: 3,
                  message: "La denominación debe tener al menos 3 caracteres",
                },
              })}
              disabled={isLoading}
            />
            {errors.denominacion && (
              <p className="text-sm text-red-500">
                {errors.denominacion.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              placeholder="Descripción opcional del evento"
              {...register("descripcion")}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha_evento">
                Fecha <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fecha_evento"
                type="date"
                {...register("fecha_evento", {
                  required: "La fecha es requerida",
                })}
                disabled={isLoading}
              />
              {errors.fecha_evento && (
                <p className="text-sm text-red-500">
                  {errors.fecha_evento.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora_inicio">
                Hora Inicio <span className="text-red-500">*</span>
              </Label>
              <Input
                id="hora_inicio"
                type="time"
                {...register("hora_inicio", {
                  required: "La hora de inicio es requerida",
                })}
                disabled={isLoading}
              />
              {errors.hora_inicio && (
                <p className="text-sm text-red-500">
                  {errors.hora_inicio.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora_fin">
                Hora Fin <span className="text-red-500">*</span>
              </Label>
              <Input
                id="hora_fin"
                type="time"
                {...register("hora_fin", {
                  required: "La hora de fin es requerida",
                })}
                disabled={isLoading}
              />
              {errors.hora_fin && (
                <p className="text-sm text-red-500">
                  {errors.hora_fin.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creando..." : "Crear Evento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
