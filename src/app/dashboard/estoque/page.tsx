import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VehicleManagement } from "@/components/VehicleManagement";

export default async function EstoquePage() {
  const session = await auth();

  // Se não estiver logado ou não tiver uma loja (ex: SUPER_ADMIN puro), bloqueia o acesso
  if (!session || !session.user?.storeId) {
    redirect("/dashboard");
  }

  const storeId = session.user.storeId;

  // Busca APENAS os veículos dessa loja
  const storeVehicles = await prisma.vehicle.findMany({
    where: { storeId: storeId },
    orderBy: { id: "desc" },
  });

  return (
    <div className="p-6 lg:p-8">
      <VehicleManagement initialVehicles={storeVehicles} />
    </div>
  );
}