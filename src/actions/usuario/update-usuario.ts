"use server";

import prisma from "@/lib/prisma";

interface UpdateUsuarioData {
  id_usuario: string;
  role: "administrador" | "organizador" | "asistencia";
  activo: boolean;
}

export const updateUsuario = async (data: UpdateUsuarioData) => {
  try {
    const usuario = await prisma.usuario.update({
      where: { id_usuario: data.id_usuario },
      data: {
        role: data.role,
        activo: data.activo,
      },
    });

    return {
      ok: true,
      message: "Usuario actualizado exitosamente",
      usuario: {
        id_usuario: usuario.id_usuario,
        correo: usuario.correo,
        name: usuario.name,
        role: usuario.role,
        activo: usuario.activo,
      },
    };
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return {
      ok: false,
      error: "Error al actualizar el usuario",
    };
  }
};
