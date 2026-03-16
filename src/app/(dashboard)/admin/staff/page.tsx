import { prisma } from "@/lib/prisma";
import StaffClient from "./StaffClient";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const staff = await prisma.staff.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        }
      },
      services: {
        select: {
          name: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <StaffClient initialStaff={staff} />;
}
