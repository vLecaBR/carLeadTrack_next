import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StoreSettings } from "@/components/StoreSettings";

export default async function ConfigPage() {
  const session = await auth();

  // Trava de segurança: Se não for dono OU se o storeId for nulo, chuta pro dashboard
  if (!session || session.user?.role !== "OWNER" || !session.user?.storeId) {
    redirect("/dashboard");
  }

  // Agora o TypeScript sabe que session.user.storeId é 100% uma string
  const store = await prisma.store.findUnique({
    where: { id: session.user.storeId },
  });

  if (!store) {
    redirect("/dashboard");
  }

  return (
    <div className="p-6 lg:p-8">
      <StoreSettings store={store} />
    </div>
  );
}