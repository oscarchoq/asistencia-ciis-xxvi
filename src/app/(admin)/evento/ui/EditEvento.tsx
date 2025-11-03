"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { updateEvento } from "@/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type FormData = {
  denominacion: string;
  descripcion?: string;
  fecha_evento: string | Date;
  hora_inicio: string | Date;
  hora_fin: string | Date;
  activo: boolean;
};

interface EditEventoProps {
  evento: {
    id_evento: string;
    denominacion: string;
    descripcion: string | null;
    fecha_evento: Date;
    hora_inicio: Date;
    hora_fin: Date;
    activo: boolean;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditEvento({ evento, open, onOpenChange }: EditEventoProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>();

  const selectedActivo = watch("activo");

  useEffect(() => {
    // Formatear las fechas para los inputs sin conversión de zona horaria
    const fechaEventoStr = typeof evento.fecha_evento === 'string' 
      ? evento.fecha_evento 
      : evento.fecha_evento.toISOString();
    const [yearFecha, monthFecha, dayFecha] = fechaEventoStr.split('T')[0].split('-');
    
    const horaInicioStr = typeof evento.hora_inicio === 'string'
      ? evento.hora_inicio
      : evento.hora_inicio.toISOString();
    const horaInicioTime = horaInicioStr.split('T')[1].substring(0, 5);
    
    const horaFinStr = typeof evento.hora_fin === 'string'
      ? evento.hora_fin
      : evento.hora_fin.toISOString();
    const horaFinTime = horaFinStr.split('T')[1].substring(0, 5);

    reset({
      denominacion: evento.denominacion,
      descripcion: evento.descripcion || "",
      fecha_evento: `${yearFecha}-${monthFecha}-${dayFecha}`,
      hora_inicio: horaInicioTime,
      hora_fin: horaFinTime,
      activo: evento.activo,
    });
  }, [evento, reset]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    // Validar que hora_fin sea mayor que hora_inicio
    if (data.hora_fin <= data.hora_inicio) {
      toast.error("La hora de fin debe ser mayor que la hora de inicio");
      setIsLoading(false);
      return;
    }
    
    toast.loading("Actualizando evento...");

    try {
      // Construir strings ISO en hora local (sin conversión de zona horaria)
      // Para fecha_evento: solo fecha sin hora
      const fecha_evento_iso = `${data.fecha_evento}T00:00:00.000Z`;
      
      // Para hora_inicio: fecha + hora especificada
      const hora_inicio_iso = `${data.fecha_evento}T${data.hora_inicio}:00.000Z`;
      
      // Para hora_fin: fecha + hora especificada
      const hora_fin_iso = `${data.fecha_evento}T${data.hora_fin}:00.000Z`;

      const result = await updateEvento({
        id_evento: evento.id_evento,
        denominacion: data.denominacion,
        descripcion: data.descripcion,
        fecha_evento: fecha_evento_iso,
        hora_inicio: hora_inicio_iso,
        hora_fin: hora_fin_iso,
        activo: data.activo,
      });

      toast.dismiss();

      if (result.ok) {
        toast.success(result.message || "Evento actualizado exitosamente");
        onOpenChange(false);
        // window.location.reload();
        router.refresh();
      } else {
        toast.error(result.error || "Error al actualizar evento");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error:", error);
      toast.error("Error inesperado al actualizar evento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Evento</DialogTitle>
          <DialogDescription>
            Modifica la información del evento
          </DialogDescription>
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

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="activo" className="flex-1">
              Estado del Evento
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedActivo ? "Activo" : "Inactivo"}
              </span>
              <Switch
                id="activo"
                checked={selectedActivo}
                onCheckedChange={(checked: boolean) =>
                  setValue("activo", checked)
                }
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
