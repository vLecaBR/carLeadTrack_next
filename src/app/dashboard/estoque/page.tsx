import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VehicleManagement } from "@/components/VehicleManagement";

export default async function EstoquePage() {
  const session = await auth();

  // Se não estiver logado ou não tiver uma loja
  if (!session || !session.user?.storeId) {
    redirect("/dashboard");
  }

  const storeId = session.user.storeId;

  // Busca os veículos dessa loja INCLUINDO AS IMAGENS
  const storeVehicles = await prisma.vehicle.findMany({
    where: { storeId: storeId },
    orderBy: { id: "desc" },
    include: {
      images: true, // Traz a tabela relacionada VehicleImage
    }
  });

  return (
    <div className="p-6 lg:p-8">
      <VehicleManagement initialVehicles={storeVehicles} storeId={storeId} />
    </div>
  );
}