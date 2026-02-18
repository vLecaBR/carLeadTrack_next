import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Proteção Global da rota /dashboard
  if (!session) {
    redirect("/login");
  }

  // Busca o nome da loja se o usuário estiver vinculado a uma
  let storeName = "Administração";
  if (session.user?.storeId) {
    const store = await prisma.store.findUnique({
      where: { id: session.user.storeId },
      select: { name: true },
    });
    if (store) storeName = store.name;
  }

  const userProps = {
    name: session.user?.name || "Usuário",
    role: session.user?.role || "USER",
    storeName,
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Menu Lateral Fixo criado no passo anterior */}
      <DashboardSidebar user={userProps} />

      {/* Área Central (Onde o children vai renderizar o page.tsx) */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}