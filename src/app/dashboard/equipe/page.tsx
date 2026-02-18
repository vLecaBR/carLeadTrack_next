import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TeamManagement } from "@/components/TeamManagement";

export default async function EquipePage() {
  const session = await auth();

  // Apenas donos e administradores acessam essa aba (bloqueia o SELLER)
  if (!session || session.user?.role === "SELLER") {
    redirect("/dashboard");
  }

  const storeId = session.user?.storeId;

  // Busca todos os usuários vinculados a esta loja (incluindo o próprio dono)
  let teamMembers: any[] = [];
  if (storeId) {
    teamMembers = await prisma.user.findMany({
      where: { storeId: storeId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { role: "asc" }, // Mostra o Owner primeiro, depois Sellers
    });
  }

  return (
    <div className="p-6 lg:p-8">
      {/* CORREÇÃO AQUI: O || "" garante que sempre seja uma string */}
      <TeamManagement 
        initialMembers={teamMembers} 
        currentUserId={session.user?.id || ""} 
      />
    </div>
  );
}