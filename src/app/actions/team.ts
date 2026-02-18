"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

export async function createSeller(formData: FormData) {
  try {
    const session = await auth();

    // Apenas donos de loja podem adicionar vendedores
    if (!session || session.user?.role !== "OWNER" || !session.user?.storeId) {
      return { error: "Sem permissão. Apenas donos podem adicionar equipe." };
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string; // Não temos phone na tabela User ainda, mas vamos ignorar por enquanto
    
    // Gera uma senha padrão simples (ex: mudar123) para o vendedor trocar depois
    const hashedPassword = await bcrypt.hash("mudar123", 10);

    // Cria o usuário vendedor na mesma loja do dono
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "SELLER",
        storeId: session.user.storeId,
      },
    });

    revalidatePath("/dashboard/equipe");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Erro ao criar vendedor. O e-mail já pode estar em uso." };
  }
}