import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Hash password
  const hashedPassword = await bcrypt.hash("admin123", 10);

  // 1. Create Business
  const business = await prisma.business.upsert({
    where: { slug: "demo-clinic" },
    update: {},
    create: {
      name: "Clínica Médica Central",
      slug: "demo-clinic",
      description: "Servicios médicos integrales de alta calidad.",
    },
  });

  // 2. Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      email: "admin@demo.com",
      name: "Admin User",
      password: hashedPassword,
      role: UserRole.ADMIN,
      businessId: business.id,
    },
  });

  // 3. Create Services
  const service1 = await prisma.service.create({
    data: {
      name: "Consulta General",
      description: "Chequeo de rutina y diagnóstico inicial.",
      duration: 30,
      price: 50.0,
      businessId: business.id,
    },
  });

  await prisma.service.create({
    data: {
      name: "Limpieza Dental",
      description: "Higiene bucal profunda y profilaxis.",
      duration: 45,
      price: 80.0,
      businessId: business.id,
    },
  });

  // 4. Create Staff
  const staffUser = await prisma.user.create({
    data: {
      email: "staff@demo.com",
      name: "Dr. Juan Pérez",
      password: hashedPassword,
      role: UserRole.STAFF,
      businessId: business.id,
    },
  });

  const staff = await prisma.staff.create({
    data: {
      userId: staffUser.id,
      businessId: business.id,
      title: "Médico General",
      bio: "Especialista en medicina interna con 10 años de experiencia.",
      services: {
        connect: [{ id: service1.id }],
      },
    },
  });

  // 5. Create Working Hours for Staff
  for (let i = 1; i <= 5; i++) {
    await prisma.workingHours.create({
      data: {
        staffId: staff.id,
        dayOfWeek: i,
        startTime: "09:00",
        endTime: "17:00",
      },
    });
  }

  // 6. Create Client
  const client = await prisma.user.create({
    data: {
      email: "client@demo.com",
      name: "Cliente Demo",
      password: hashedPassword,
      role: UserRole.CLIENT,
      businessId: business.id,
    },
  });

  console.log("Seeding finished.");
  console.log({
    business_id: business.id,
    admin_email: admin.email,
    staff_email: staffUser.email,
    client_email: client.email,
    password: "admin123",
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
