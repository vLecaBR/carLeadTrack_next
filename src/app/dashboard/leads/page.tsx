import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LeadManagement } from "@/components/LeadManagement";

export default async function LeadsPage() {
  const session = await auth();

  // Bloqueia o acesso se não houver loja associada
  if (!session || !session.user?.storeId) {
    redirect("/dashboard");
  }

  const storeId = session.user.storeId;

  // Busca todos os leads da loja atual
  const leads = await prisma.lead.findMany({
    where: { storeId: storeId },
    orderBy: { createdAt: "desc" }, // Os mais recentes primeiro
  });

  return (
    <div className="p-6 lg:p-8">
      <LeadManagement initialLeads={leads} />
    </div>
  );
}