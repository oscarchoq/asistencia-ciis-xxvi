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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUsuario } from "@/actions";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import type { RoleType } from "@/interfaces";

type FormData = {
  correo: string;
  password: string;
  name: string;
  role: RoleType;
};

export function CreateUsuario() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      role: "organizador",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    toast.loading("Creando usuario...");

    try {
      const result = await createUsuario(data);

      toast.dismiss();

      if (result.ok) {
        toast.success(result.message || "Usuario creado exitosamente");
        reset();
        setOpen(false);
        window.location.reload();
      } else {
        toast.error(result.error || "Error al crear usuario");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error:", error);
      toast.error("Error inesperado al crear usuario");
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
          Nuevo Usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nombre Completo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Ej: Juan Pérez"
              {...register("name", {
                required: "El nombre es requerido",
                minLength: {
                  value: 3,
                  message: "El nombre debe tener al menos 3 caracteres",
                },
                validate: (value) => {
                  const trimmed = value.trim();
                  if (trimmed.length === 0) {
                    return "El nombre no puede estar vacío";
                  }
                  return true;
                },
              })}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="correo">
              Correo Electrónico <span className="text-red-500">*</span>
            </Label>
            <Input
              id="correo"
              type="email"
              placeholder="Ej: usuario@ejemplo.com"
              {...register("correo", {
                required: "El correo es requerido",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Correo electrónico inválido",
                },
                validate: (value) => {
                  const trimmed = value.trim();
                  if (trimmed.length === 0) {
                    return "El correo no puede estar vacío";
                  }
                  return true;
                },
              })}
              disabled={isLoading}
            />
            {errors.correo && (
              <p className="text-sm text-red-500">{errors.correo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Contraseña <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              {...register("password", {
                required: "La contraseña es requerida",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              })}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">
              Rol <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedRole}
              onValueChange={(value) =>
                setValue("role", value as FormData["role"])
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="administrador">Administrador</SelectItem>
                <SelectItem value="organizador">Organizador</SelectItem>
                <SelectItem value="asistencia">Asistencia</SelectItem>
                <SelectItem value="kits">Kits</SelectItem>
                <SelectItem value="recepcion">Recepción</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
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
              {isLoading ? "Creando..." : "Crear Usuario"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
