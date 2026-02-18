"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

// --- FUNÇÃO ANTIGA (MANTIDA INTACTA) ---
export async function createStore(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const cnpj = formData.get("cnpj") as string;
    const ownerName = formData.get("ownerName") as string;
    const ownerEmail = formData.get("ownerEmail") as string;
    const rawPassword = formData.get("password") as string;

    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    await prisma.$transaction(async (tx) => {
      const store = await tx.store.create({
        data: {
          name,
          slug,
          cnpj,
          address: "Endereço pendente",
          plan: "PRO",
          ownerName,
        },
      });

      await tx.user.create({
        data: {
          name: ownerName,
          email: ownerEmail,
          password: hashedPassword,
          role: "OWNER",
          storeId: store.id,
        },
      });
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar loja:", error);
    return { error: "Erro ao criar loja. Verifique se o CNPJ ou Slug já existem." };
  }
}

// --- NOVA FUNÇÃO (SALVAR CONFIGURAÇÕES DA LOJA) ---
export async function updateStoreSettings(storeId: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const primaryColor = formData.get("primaryColor") as string;

    await prisma.store.update({
      where: { id: storeId },
      data: { name, address, phone, primaryColor },
    });

    revalidatePath("/dashboard/configuracoes");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar loja:", error);
    return { error: "Erro ao atualizar configurações." };
  }
}