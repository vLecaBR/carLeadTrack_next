"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// 1. CRIAR VEÍCULO
export async function createVehicle(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.storeId) return { error: "Sem permissão ou sem loja associada." };
    const storeId = session.user.storeId;

    const brand = formData.get("brand") as string;
    const model = formData.get("model") as string;
    const year = parseInt(formData.get("year") as string);
    // Limpa a formatação de "R$ 85.000,00" para salvar como float 85000 no banco
    const rawPrice = formData.get("price") as string;
    const price = parseFloat(rawPrice.replace(/\D/g, '')) / 100; 
    
    const km = parseInt(formData.get("km") as string) || 0;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string; // Link da imagem

    await prisma.vehicle.create({
      data: {
        brand,
        model,
        year,
        price,
        km,
        description,
        storeId,
        // Cria a relação com a imagem se o usuário tiver preenchido a URL
        ...(imageUrl ? { images: { create: { url: imageUrl } } } : {})
      },
    });

    revalidatePath("/dashboard/estoque");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar veículo:", error);
    return { error: "Ocorreu um erro ao registrar." };
  }
}

// 2. EDITAR VEÍCULO
export async function updateVehicle(vehicleId: string, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.storeId) return { error: "Sem permissão." };

    const brand = formData.get("brand") as string;
    const model = formData.get("model") as string;
    const year = parseInt(formData.get("year") as string);
    const rawPrice = formData.get("price") as string;
    const price = parseFloat(rawPrice.replace(/\D/g, '')) / 100;
    const km = parseInt(formData.get("km") as string) || 0;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string;

    // Atualiza os dados básicos do carro
    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { brand, model, year, price, km, description },
    });

    // Atualiza a imagem: deleta as antigas e insere a nova (Lógica simples para MVP)
    await prisma.vehicleImage.deleteMany({ where: { vehicleId } });
    if (imageUrl && imageUrl.trim() !== "") {
      await prisma.vehicleImage.create({
        data: { url: imageUrl, vehicleId }
      });
    }

    revalidatePath("/dashboard/estoque");
    return { success: true };
  } catch (error) {
    console.error("Erro ao editar veículo:", error);
    return { error: "Ocorreu um erro ao editar o veículo." };
  }
}

// 3. EXCLUIR VEÍCULO
export async function deleteVehicle(vehicleId: string) {
  try {
    const session = await auth();
    if (!session?.user?.storeId) return { error: "Sem permissão." };

    await prisma.vehicle.delete({
      where: { id: vehicleId },
    });

    revalidatePath("/dashboard/estoque");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar veículo:", error);
    return { error: "Erro ao excluir. O veículo pode estar associado a leads." };
  }
}