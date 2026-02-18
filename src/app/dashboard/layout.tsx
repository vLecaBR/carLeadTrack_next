import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  let storeName = "Administração";
  let storeSlug = null;
  
  // Busca o nome E O SLUG da loja
  if (session.user?.storeId) {
    const store = await prisma.store.findUnique({
      where: { id: session.user.storeId },
      select: { name: true, slug: true },
    });
    if (store) {
      storeName = store.name;
      storeSlug = store.slug;
    }
  }

  const userProps = {
    name: session.user?.name || "Usuário",
    role: session.user?.role || "USER",
    storeName,
    storeSlug, // Passando o slug para o botão da Sidebar funcionar!
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <DashboardSidebar user={userProps} />

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}