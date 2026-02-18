import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { StorefrontPublic } from "@/components/StorefrontPublic";

export default async function LojaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const store = await prisma.store.findUnique({
    where: { slug: slug },
    include: {
      vehicles: {
        orderBy: { id: "desc" },
      },
    },
  });

  if (!store) {
    notFound();
  }

  return <StorefrontPublic store={store} vehicles={store.vehicles} />;
}