import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminLeadsKanban } from "@/components/AdminLeadsKanban";

export default async function LeadsGlobaisPage() {
  const session = await auth();

  if (!session || session.user?.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  // Busca todos os leads de TODAS as lojas
  // e o 'include' traz o nome da loja para mostrar no card!
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      store: {
        select: { name: true }
      }
    }
  });

  return (
    <div className="p-6 lg:p-8">
      <AdminLeadsKanban initialLeads={leads as any} />
    </div>
  );
}