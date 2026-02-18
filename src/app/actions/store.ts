"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

export async function createStore(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const cnpj = formData.get("cnpj") as string;
    const ownerName = formData.get("ownerName") as string;
    const ownerEmail = formData.get("ownerEmail") as string;
    const rawPassword = formData.get("password") as string;

    // 1. Criptografar a senha do dono da loja
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // 2. Transação: Cria a loja E o usuário Dono ao mesmo tempo
    await prisma.$transaction(async (tx) => {
      const store = await tx.store.create({
        data: {
          name,
          slug, // Ex: 'loja-do-joao' (vai ser a URL dele depois)
          cnpj,
          address: "Endereço pendente", // Pode ser editado pelo dono depois
          plan: "PRO",
          ownerName,
        },
      });

      await tx.user.create({
        data: {
          name: ownerName,
          email: ownerEmail,
          password: hashedPassword,
          role: "OWNER", // Define que ele é o dono
          storeId: store.id, // Vincula o usuário à loja criada
        },
      });
    });

    // 3. Atualiza a página do painel para mostrar a nova loja na lista
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar loja:", error);
    return { error: "Erro ao criar loja. Verifique se o CNPJ ou Slug já existem." };
  }
}