import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StoreManagement } from "@/components/StoreManagement";

export default async function LojasAdminPage() {
  const session = await auth();

  if (!session || session.user?.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  // Busca todas as lojas, seus usuários e contagem de métricas
  const stores = await prisma.store.findMany({
    orderBy: { id: "desc" }, // <-- CORRIGIDO AQUI! Ordenando pelo ID
    include: {
      users: {
        select: { id: true, name: true, email: true, role: true }
      },
      _count: {
        select: { leads: true, vehicles: true }
      }
    }
  });

  return (
    <div className="p-6 lg:p-8">
      <StoreManagement stores={stores as any} />
    </div>
  );
}