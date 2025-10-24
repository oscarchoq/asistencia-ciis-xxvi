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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { updateUsuario } from "@/actions";
import { toast } from "sonner";

type FormData = {
  role: "administrador" | "organizador" | "asistencia";
  activo: boolean;
};

interface EditUsuarioProps {
  usuario: {
    id_usuario: string;
    correo: string;
    name: string;
    role: "administrador" | "organizador" | "asistencia";
    activo: boolean;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUsuario({ usuario, open, onOpenChange }: EditUsuarioProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, setValue, watch, reset } = useForm<FormData>({
    defaultValues: {
      role: usuario.role,
      activo: usuario.activo,
    },
  });

  const selectedRole = watch("role");
  const selectedActivo = watch("activo");

  useEffect(() => {
    reset({
      role: usuario.role,
      activo: usuario.activo,
    });
  }, [usuario, reset]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    toast.loading("Actualizando usuario...");

    try {
      const result = await updateUsuario({
        id_usuario: usuario.id_usuario,
        role: data.role,
        activo: data.activo,
      });

      toast.dismiss();

      if (result.ok) {
        toast.success(result.message || "Usuario actualizado exitosamente");
        onOpenChange(false);
        window.location.reload();
      } else {
        toast.error(result.error || "Error al actualizar usuario");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error:", error);
      toast.error("Error inesperado al actualizar usuario");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>
            Modifica el rol y el estado del usuario
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input
              id="name"
              value={usuario.name}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="correo">Correo Electrónico</Label>
            <Input
              id="correo"
              value={usuario.correo}
              disabled
              className="bg-muted"
            />
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
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="activo" className="flex-1">
              Estado del Usuario
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedActivo ? "Activo" : "Inactivo"}
              </span>
              <Switch
                id="activo"
                checked={selectedActivo}
                onCheckedChange={(checked: boolean) => setValue("activo", checked)}
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
