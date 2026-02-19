import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CreateStoreForm } from "@/components/CreateStoreForm";
import { OwnerDashboard } from "@/components/OwnerDashboard";
import { AdminHome } from "@/components/AdminHome"; 

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const role = session.user?.role;
  const storeId = session.user?.storeId;
  const userName = session.user?.name || "Usuário";

  let adminStats = null;
  if (role === "SUPER_ADMIN") {
    const totalStoresCount = await prisma.store.count();
    const storesList = await prisma.store.findMany({
      select: { id: true, name: true, slug: true, subscriptionActive: true, plan: true },
      orderBy: { id: "desc" }
    });
    const totalUsersCount = await prisma.user.count({
      where: { role: { not: "SUPER_ADMIN" } }
    });
    const allLeads = await prisma.lead.findMany();
    const totalLeads = allLeads.length;
    const leadsConvertidos = allLeads.filter(l => l.status === "VISITED" || l.status === "CLOSED_SALE").length;

    adminStats = {
      totalStores: totalStoresCount,
      activeStores: storesList.filter(s => s.subscriptionActive).length,
      storesList: storesList,
      totalUsers: totalUsersCount,
      totalLeads: totalLeads,
      leadsConvertidos: leadsConvertidos,
      leadsPendentes: allLeads.filter(l => l.status === "NEW").length,
      vendasFechadas: allLeads.filter(l => l.status === "CLOSED_SALE").length,
    };
  }

  return (
    <div className="p-6 lg:p-8">
      {role === "SUPER_ADMIN" && adminStats && (
        <div className="space-y-12">
          <AdminHome userName={userName} stats={adminStats} />
          <div className="mx-auto max-w-3xl hidden"> {/* Escondido pois agora temos a aba Lojas */}
            <CreateStoreForm />
          </div>
        </div>
      )}

      {role === "OWNER" && storeId && (
        <OwnerDashboard storeId={storeId} userName={userName} />
      )}

      {role === "SELLER" && storeId && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Área do Vendedor</h2>
          <p className="mt-2 text-gray-600">Bem-vindo, {userName}. Acesse as abas laterais para gerenciar o Estoque e os Leads.</p>
        </div>
      )}
    </div>
  );
}