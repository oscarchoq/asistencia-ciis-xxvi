"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateInscripcion } from "@/actions";
import { toast } from "sonner";
import { PlanType, PaymentMethod, InscriptionType, Inscripcion } from '@prisma/client';
import clsx from "clsx";
import { SemestreType } from "@/interfaces";


interface FormData {
  correo: string;
  nombres: string;
  apellidos: string;
  numero_documento: string;
  celular: string;
  plan: PlanType | "";
  metodo_pago: PaymentMethod | "";
  tipo_inscripcion: InscriptionType;
  pais?: string;
  universidad?: string;
  observaciones?: string;
  codigo_matricula?: string;
  semestre?: SemestreType | "";
}

interface EditInscripcionProps {
  inscripcion: Inscripcion;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditInscripcion({ inscripcion, open, onOpenChange }: EditInscripcionProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      correo: inscripcion.correo,
      nombres: inscripcion.nombres,
      apellidos: inscripcion.apellidos,
      numero_documento: inscripcion.numero_documento,
      celular: inscripcion.celular,
      plan: inscripcion.plan,
      metodo_pago: inscripcion.metodo_pago,
      tipo_inscripcion: inscripcion.tipo_inscripcion,
      pais: inscripcion.pais || "",
      universidad: inscripcion.universidad || "",
      observaciones: inscripcion.observaciones || "",
      codigo_matricula: inscripcion.codigo_matricula || "",
      semestre: inscripcion.semestre || "",
    },
  });

  // Actualizar valores cuando cambia la inscripción
  useEffect(() => {
    reset({
      correo: inscripcion.correo,
      nombres: inscripcion.nombres,
      apellidos: inscripcion.apellidos,
      numero_documento: inscripcion.numero_documento,
      celular: inscripcion.celular,
      plan: inscripcion.plan,
      metodo_pago: inscripcion.metodo_pago,
      tipo_inscripcion: inscripcion.tipo_inscripcion,
      pais: inscripcion.pais || "",
      universidad: inscripcion.universidad || "",
      observaciones: inscripcion.observaciones || "",
      codigo_matricula: inscripcion.codigo_matricula || "",
      semestre: inscripcion.semestre || "",
    });
  }, [inscripcion, reset]);

  const plan = watch("plan");
  const metodo_pago = watch("metodo_pago");
  const tipo_inscripcion = watch("tipo_inscripcion");
  const semestre = watch("semestre");

  const onSubmit = async (data: FormData) => {
    // Validación adicional para los selects
    if (!data.plan) {
      toast.error("Por favor selecciona un plan");
      return;
    }
    if (!data.metodo_pago) {
      toast.error("Por favor selecciona un método de pago");
      return;
    }

    // Validar que los campos no estén vacíos o solo con espacios
    if (!data.nombres?.trim()) {
      toast.error("Por favor ingresa los nombres");
      return;
    }
    if (!data.apellidos?.trim()) {
      toast.error("Por favor ingresa los apellidos");
      return;
    }
    if (!data.numero_documento?.trim()) {
      toast.error("Por favor ingresa el número de documento");
      return;
    }
    if (!data.celular?.trim()) {
      toast.error("Por favor ingresa el celular");
      return;
    }
    if (!data.correo?.trim()) {
      toast.error("Por favor ingresa el correo");
      return;
    }

    setIsLoading(true);
    toast.loading("Actualizando inscripción...");

    try {
      const result = await updateInscripcion({
        id_inscripcion: inscripcion.id_inscripcion,
        correo: data.correo.trim(),
        nombres: data.nombres.trim(),
        apellidos: data.apellidos.trim(),
        numero_documento: data.numero_documento.trim(),
        celular: data.celular.trim(),
        plan: data.plan as PlanType,
        metodo_pago: data.metodo_pago as PaymentMethod,
        tipo_inscripcion: data.tipo_inscripcion,
        pais: data.pais?.trim() || undefined,
        universidad: data.universidad?.trim() || undefined,
        observaciones: data.observaciones?.trim() || undefined,
        codigo_matricula: data.codigo_matricula?.trim() || undefined,
        semestre: (data.semestre as SemestreType) || undefined,
      });

      toast.dismiss();

      if (result.ok) {
        toast.success(result.message || "Inscripción actualizada exitosamente");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.error || "Error al actualizar la inscripción");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error:", error);
      toast.error("Error inesperado al actualizar la inscripción");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Editar Inscripción</DialogTitle>
          <DialogDescription>
            Modifica los datos de la inscripción.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {/* Fila 1: Nombres y Apellidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombres">
                  Nombres <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombres"
                  placeholder="Ingresa los nombres"
                  className="w-full"
                  autoComplete="given-name"
                  {...register("nombres", {
                    required: "Los nombres son obligatorios",
                    validate: (value) =>
                      value.trim().length > 0 ||
                      "Los nombres no pueden estar vacíos",
                  })}
                />
                {errors.nombres && (
                  <p className="text-xs text-red-500">
                    {errors.nombres.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellidos">
                  Apellidos <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="apellidos"
                  placeholder="Ingresa los apellidos"
                  className="w-full"
                  autoComplete="family-name"
                  {...register("apellidos", {
                    required: "Los apellidos son obligatorios",
                    validate: (value) =>
                      value.trim().length > 0 ||
                      "Los apellidos no pueden estar vacíos",
                  })}
                />
                {errors.apellidos && (
                  <p className="text-xs text-red-500">
                    {errors.apellidos.message}
                  </p>
                )}
              </div>
            </div>

            {/* Fila 2: N° Documento y Celular */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numero_documento">
                  N° Documento <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="numero_documento"
                  placeholder="DNI o documento"
                  className="w-full"
                  autoComplete="off"
                  {...register("numero_documento", {
                    required: "El número de documento es obligatorio",
                    validate: (value) =>
                      value.trim().length > 0 ||
                      "El número de documento no puede estar vacío",
                    minLength: {
                      value: 6,
                      message: "El documento debe tener al menos 6 caracteres",
                    },
                    maxLength: {
                      value: 20,
                      message: "El documento no puede tener más de 20 caracteres",
                    },
                  })}
                />
                {errors.numero_documento && (
                  <p className="text-xs text-red-500">
                    {errors.numero_documento.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="celular">
                  Celular <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="celular"
                  placeholder="Número de celular"
                  className="w-full"
                  autoComplete="tel"
                  {...register("celular", {
                    required: "El celular es obligatorio",
                    validate: (value) =>
                      value.trim().length > 0 ||
                      "El celular no puede estar vacío",
                    pattern: {
                      value: /^[0-9+\s()-]+$/,
                      message: "El celular debe contener solo números",
                    },
                    minLength: {
                      value: 7,
                      message: "El celular debe tener al menos 7 dígitos",
                    },
                  })}
                />
                {errors.celular && (
                  <p className="text-xs text-red-500">
                    {errors.celular.message}
                  </p>
                )}
              </div>
            </div>

            {/* Fila 3: Correo (completo) */}
            <div className="space-y-2">
              <Label htmlFor="correo">
                Correo Electrónico <span className="text-red-500">*</span>
              </Label>
              <Input
                id="correo"
                type="email"
                placeholder="ejemplo@correo.com"
                className="w-full"
                autoComplete="email"
                {...register("correo", {
                  required: "El correo es obligatorio",
                  validate: (value) =>
                    value.trim().length > 0 || "El correo no puede estar vacío",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Correo electrónico inválido",
                  },
                })}
              />
              {errors.correo && (
                <p className="text-xs text-red-500">{errors.correo.message}</p>
              )}
            </div>

            {/* Fila 4: Plan, Tipo y Método de Pago */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo_inscripcion">
                  Tipo Inscripción<span className="text-red-500">*</span>
                </Label>
                <Select
                  value={tipo_inscripcion}
                  onValueChange={(value) =>
                    setValue("tipo_inscripcion", value as InscriptionType, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="presencial">Presencial</SelectItem>
                    <SelectItem value="virtual">Virtual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan">
                  Plan <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={plan}
                  onValueChange={(value) =>
                    setValue("plan", value as PlanType, { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="profesionales">Profesionales</SelectItem>
                    <SelectItem value="estudiantes">Estudiantes</SelectItem>
                    <SelectItem value="delegaciones">Delegaciones</SelectItem>
                    <SelectItem value="docenteesis">Docente ESIS</SelectItem>
                    <SelectItem value="estudianteesis">
                      Estudiante ESIS
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metodo_pago">
                  Método de Pago <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={metodo_pago}
                  onValueChange={(value) =>
                    setValue("metodo_pago", value as PaymentMethod, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yape">Yape</SelectItem>
                    <SelectItem value="bcp">BCP</SelectItem>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fila condicional: Código de Matrícula y Semestre (solo para estudianteesis) */}
            {plan === "estudianteesis" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo_matricula">
                    Código de Matrícula <span className="text-muted-foreground text-xs">(Opcional)</span>
                  </Label>
                  <Input
                    id="codigo_matricula"
                    placeholder="Ingresa el código de matrícula"
                    className="w-full"
                    autoComplete="off"
                    {...register("codigo_matricula")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semestre">
                    Semestre <span className="text-muted-foreground text-xs">(Opcional)</span>
                  </Label>
                  <Select
                    value={semestre}
                    onValueChange={(value) =>
                      setValue("semestre", value as SemestreType, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona semestre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="segundo">Segundo</SelectItem>
                      <SelectItem value="cuarto">Cuarto</SelectItem>
                      <SelectItem value="sexto">Sexto</SelectItem>
                      <SelectItem value="octavo">Octavo</SelectItem>
                      <SelectItem value="decimo">Décimo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Fila condicional: País y Universidad (NO se muestra para estudianteesis ni docenteesis) */}
            {plan !== "estudianteesis" && plan !== "docenteesis" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pais">País</Label>
                  <Input
                    id="pais"
                    placeholder="País de origen"
                    className="w-full"
                    autoComplete="country-name"
                    {...register("pais")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="universidad">Universidad</Label>
                  <Input
                    id="universidad"
                    placeholder="Universidad o institución"
                    className="w-full"
                    autoComplete="organization"
                    {...register("universidad")}
                  />
                </div>
              </div>
            )}

            {/* Observaciones */}
            <div className="space-y-2">
              <Label htmlFor="observaciones">
                Observaciones <span className="text-muted-foreground text-xs">(Opcional)</span>
              </Label>
              <Textarea
                id="observaciones"
                placeholder="Ingresa observaciones adicionales..."
                className="w-full resize-none"
                rows={3}
                {...register("observaciones")}
              />
              {errors.observaciones && (
                <p className="text-xs text-red-500">
                  {errors.observaciones.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className={
                clsx(
                  "ml-2", 
                  {
                    'btn-disabled': isLoading
                  }
                )}
              >
              {isLoading ? "Actualizando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
