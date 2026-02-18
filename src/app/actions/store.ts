"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

// 1. CRIAR LOJA + DONO (Ação do Super Admin)
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
          slug: slug.toLowerCase(),
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

    revalidatePath("/dashboard/lojas");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar loja:", error);
    return { error: "Erro ao criar loja. Verifique se o CNPJ ou Slug já existem." };
  }
}

// 2. ATUALIZAR CONFIGURAÇÕES (Ação do Lojista/Dono)
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

// 3. EDITAR LOJA COMPLETA (Ação do Super Admin)
export async function editStore(storeId: string, formData: FormData) {
  try {
    const name = formData.get("nome") as string;
    const cnpj = formData.get("cnpj") as string;
    const slug = (formData.get("slug") as string).toLowerCase();
    const plan = formData.get("plano") as string;
    const status = formData.get("status") as string;
    const address = formData.get("endereco") as string;
    const phone = formData.get("telefone") as string;
    const primaryColor = formData.get("color") as string;

    await prisma.store.update({
      where: { id: storeId },
      data: {
        name,
        cnpj,
        slug,
        plan,
        subscriptionActive: status === "active",
        address,
        phone,
        primaryColor,
      },
    });

    revalidatePath("/dashboard/lojas");
    return { success: true };
  } catch (error) {
    console.error("Erro ao editar loja:", error);
    return { error: "Erro ao atualizar os dados. Verifique se o Slug ou CNPJ já estão em uso." };
  }
}

// 4. BLOQUEAR/DESBLOQUEAR (Ação Rápida do Admin)
export async function toggleStoreSubscription(storeId: string, currentStatus: boolean) {
  try {
    await prisma.store.update({
      where: { id: storeId },
      data: { subscriptionActive: !currentStatus }, 
    });

    revalidatePath("/dashboard/lojas");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Erro ao alterar o status da loja." };
  }
}

// 5. EXCLUIR LOJA (Ação do Super Admin)
export async function deleteStore(storeId: string) {
  try {
    // O Prisma deleta em cascata se configurado, ou limpa as relações aqui
    await prisma.store.delete({
      where: { id: storeId }
    });

    revalidatePath("/dashboard/lojas");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir loja:", error);
    return { error: "Erro ao excluir. Certifique-se de que a loja não possui dependências críticas." };
  }
}