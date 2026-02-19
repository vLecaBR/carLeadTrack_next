import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { StorefrontPublic } from "@/components/StorefrontPublic";

// ESSA É A LINHA MÁGICA QUE DESLIGA O CACHE E MOSTRA OS DADOS EM TEMPO REAL
export const dynamic = 'force-dynamic';

export default async function LojaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const store = await prisma.store.findUnique({
    where: { slug: slug },
    include: {
      vehicles: {
        where: { isAvailable: true }, // Traz só os disponíveis
        orderBy: { id: "desc" },
        include: {
          images: true, // Traz as imagens que vimos no seu banco!
        }
      },
    },
  });

  if (!store) {
    notFound();
  }

  return <StorefrontPublic store={store} vehicles={store.vehicles} />;
}