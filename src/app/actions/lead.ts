"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Ação para criar um lead de teste manualmente
export async function createLead(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.storeId) return { error: "Sem permissão." };

    const customerName = formData.get("customerName") as string;
    const customerPhone = formData.get("customerPhone") as string;
    const value = parseFloat(formData.get("value") as string) || 0;

    await prisma.lead.create({
      data: {
        customerName,
        customerPhone,
        value,
        status: "NEW",
        storeId: session.user.storeId,
      },
    });

    revalidatePath("/dashboard/leads");
    return { success: true };
  } catch (error) {
    return { error: "Erro ao criar lead." };
  }
}

// Ação para mover o lead de coluna
export async function updateLeadStatus(leadId: string, newStatus: string) {
  try {
    const session = await auth();
    if (!session?.user?.storeId) return { error: "Sem permissão." };

    await prisma.lead.update({
      where: { 
        id: leadId,
        storeId: session.user.storeId // Garantia de segurança (só atualiza se for da loja dele)
      },
      data: { status: newStatus as any },
    });

    revalidatePath("/dashboard/leads");
    return { success: true };
  } catch (error) {
    return { error: "Erro ao atualizar estado." };
  }
}