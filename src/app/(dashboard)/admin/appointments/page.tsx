import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getAppointments } from "@/app/actions/appointments";
import { redirect } from "next/navigation";
import { AppointmentsTable } from "./AppointmentsTable";

export default async function AdminAppointmentsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN" || !session.user.businessId) {
    redirect("/login");
  }

  const businessId = session.user.businessId;
  const result = await getAppointments(businessId);
  const appointments = result.success ? result.appointments : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Gestión de Turnos</h1>
        <p className="text-muted-foreground mt-1">Administra y organiza la agenda de tu negocio.</p>
      </div>

      <div className="bg-card border rounded-3xl overflow-hidden shadow-sm">
        <AppointmentsTable initialAppointments={appointments} />
      </div>
    </div>
  );
}
