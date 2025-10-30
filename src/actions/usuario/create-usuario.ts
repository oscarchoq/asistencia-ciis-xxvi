"use server";

import prisma from "@/lib/prisma";
import { normalizeEmail, capitalizeName } from "@/lib/string-utils";
import bcrypt from "bcryptjs";
import type { RoleType } from "@/interfaces";
import { auth } from "@/auth.config";

interface CreateUsuarioData {
  correo: string;
  password: string;
  name: string;
  role: RoleType;
}

export const createUsuario = async (data: CreateUsuarioData) => {
  try {

    // Verificar que el usuario esté autenticado
    const session = await auth();
    if (!session?.user?.id_usuario) {
      return {
        ok: false,
        error: "No autorizado - Debe iniciar sesión",
      };
    }

    // Normalizar datos
    const normalizedEmail = normalizeEmail(data.correo);
    const normalizedName = capitalizeName(data.name);

    // Verificar si el correo ya existe
    const existingUsuario = await prisma.usuario.findUnique({
      where: { correo: normalizedEmail },
    });

    if (existingUsuario) {
      return {
        ok: false,
        error: "Ya existe un usuario con este correo",
      };
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Crear usuario
    const usuario = await prisma.usuario.create({
      data: {
        correo: normalizedEmail,
        password: hashedPassword,
        name: normalizedName,
        role: data.role,
      },
    });

    return {
      ok: true,
      message: "Usuario creado exitosamente",
      usuario: {
        id_usuario: usuario.id_usuario,
        correo: usuario.correo,
        name: usuario.name,
        role: usuario.role,
        activo: usuario.activo,
      },
    };
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return {
      ok: false,
      error: "Error al crear el usuario",
    };
  }
};
