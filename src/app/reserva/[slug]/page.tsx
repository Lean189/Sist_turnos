import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookingClient from "./BookingClient";

export const dynamic = "force-dynamic";

export default async function PublicBookingPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // 1. Buscar el negocio por slug
  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      services: {
        where: { staff: { some: {} } }, // Solo servicios que tienen staff asignado
      },
      staff: {
        include: {
          user: true,
          services: true,
        },
      },
    },
  });

  if (!business) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <BookingClient business={business} />
    </main>
  );
}
