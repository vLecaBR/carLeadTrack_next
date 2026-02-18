"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Ação para criar um lead de teste manualmente (pelo painel)
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

// Ação para mover o lead de coluna (Kanban)
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

// ==============================================================
// NOVA FUNÇÃO: Cria um lead a partir da vitrine PÚBLICA (Sem login)
// ==============================================================
export async function createPublicLead(storeId: string, formData: FormData) {
  try {
    const customerName = formData.get("nome") as string;
    const customerPhone = formData.get("telefone") as string;
    
    // Cria o lead com status NEW e vincula à loja específica da URL
    const lead = await prisma.lead.create({
      data: {
        storeId,
        customerName,
        customerPhone,
        status: "NEW",
        value: 15.00, // Exemplo de custo do lead (pode ser 0 se for orgânico)
      }
    });

    // Avisa o painel do dono da loja que tem lead novo lá!
    revalidatePath("/dashboard/leads");
    revalidatePath("/dashboard");

    // Retorna os últimos 6 caracteres do ID como se fosse o "QR Code" pro cliente
    return { success: true, qrCode: lead.id.slice(-6).toUpperCase() };
  } catch (error) {
    console.error("Erro no Lead Público:", error);
    return { error: "Erro ao enviar interesse. Tente novamente." };
  }
}