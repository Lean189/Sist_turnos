import { prisma } from "@/lib/prisma";
import ServicesClient from "./ServicesClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const session = await getServerSession(authOptions);
  const businessId = session?.user?.businessId;

  const services = await prisma.service.findMany({
    where: {
      businessId: businessId || undefined,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <ServicesClient initialServices={services} businessId={businessId} />;
}
