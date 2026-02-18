"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createVehicle(formData: FormData) {
  try {
    const session = await auth();

    if (!session?.user?.storeId) {
      return { error: "Sem permissão ou sem loja associada." };
    }

    const storeId = session.user.storeId;

    const brand = formData.get("brand") as string;
    const model = formData.get("model") as string;
    const year = parseInt(formData.get("year") as string);
    const price = parseFloat(formData.get("price") as string);
    const km = parseInt(formData.get("km") as string);
    const description = formData.get("description") as string;

    await prisma.vehicle.create({
      data: {
        brand,
        model,
        year,
        price,
        km,
        description,
        storeId,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar veículo:", error);
    return { error: "Ocorreu um erro ao registrar." };
  }
}