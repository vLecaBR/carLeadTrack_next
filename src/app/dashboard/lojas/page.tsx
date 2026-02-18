import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StoreManagement } from "@/components/StoreManagement";

export default async function LojasAdminPage() {
  const session = await auth();

  if (!session || session.user?.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  // A mágica está aqui: incluir o createdAt e o _count
  const stores = await prisma.store.findMany({
    orderBy: { id: "desc" },
    include: {
      _count: {
        select: {
          leads: true,
          vehicles: true,
          users: true,
        },
      },
    },
  });

  return (
    <div className="p-6 lg:p-8">
      {/* O TypeScript agora vai reconhecer que o array tem tudo que o StoreData precisa */}
      <StoreManagement stores={stores as any} />
    </div>
  );
}