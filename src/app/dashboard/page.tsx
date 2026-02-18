import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CreateStoreForm } from "@/components/CreateStoreForm";
import { LogoutButton } from "@/components/LogoutButton";
import { OwnerDashboard } from "@/components/OwnerDashboard";
import { VehicleManagement } from "@/components/VehicleManagement";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();

  // Proteção de Rota: Se não tem sessão, volta pro login
  if (!session) {
    redirect("/login");
  }

  const role = session.user?.role;
  const storeId = session.user?.storeId;
  const userName = session.user?.name || "Usuário";

  // Busca os veículos do banco APENAS se o usuário pertencer a uma loja
  let storeVehicles: any[] = [];
  if (storeId) {
    storeVehicles = await prisma.vehicle.findMany({
      where: { storeId: storeId },
      orderBy: { id: "desc" },
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de Navegação Superior */}
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold text-gray-900">MVPCarLead</h1>
          <div className="flex items-center gap-4">
            <span className="rounded bg-blue-100 px-2.5 py-1 text-xs font-semibold tracking-wide text-blue-800">
              {role}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        
        {/* VISÃO DO SUPER ADMIN */}
        {role === "SUPER_ADMIN" && (
          <div className="mx-auto max-w-3xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Administração Global</h2>
              <p className="text-gray-600">Cadastre e gerencie os lojistas da plataforma.</p>
            </div>
            <CreateStoreForm />
          </div>
        )}

        {/* VISÃO DO DONO DA LOJA (João, Carlinhos, etc) */}
        {role === "OWNER" && storeId && (
          <div className="space-y-8">
            {/* O componente mágico que só busca dados da loja logada */}
            <OwnerDashboard storeId={storeId} userName={userName} />

            {/* Novo Componente de Gestão de Estoque */}
            <VehicleManagement initialVehicles={storeVehicles} />
          </div>
        )}

        {/* VISÃO DO VENDEDOR (SELLER) */}
        {role === "SELLER" && storeId && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Área do Vendedor</h2>
            <p className="mt-2 text-gray-600">Bem-vindo, {userName}. Aqui você gerencia seus leads e vendas.</p>
            {/* O Kanban de Leads entrará aqui futuramente */}
          </div>
        )}

      </main>
    </div>
  );
}