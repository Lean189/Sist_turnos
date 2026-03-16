"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  User, 
  Mail, 
  Briefcase,
} from "lucide-react";
import { deleteStaff } from "@/app/actions/staff";

interface StaffMember {
  id: string;
  user: {
    name: string | null;
    email: string;
  };
  title: string | null;
  services: {
    name: string;
  }[];
}

interface StaffClientProps {
  initialStaff: StaffMember[];
}

export default function StaffClient({ initialStaff }: StaffClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [staffList, setStaffList] = useState(initialStaff);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar a este miembro del equipo?")) return;

    const result = await deleteStaff(id);
    if (result.success) {
      setStaffList(staffList.filter(s => s.id !== id));
    } else {
      alert(result.error);
    }
  };

  const filteredStaff = staffList.filter(s => 
    s.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Personal</h1>
          <p className="text-muted-foreground mt-1">Administra tu equipo y sus responsabilidades.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar personal..."
              className="pl-10 pr-4 py-2 bg-background border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-hidden"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95">
            <Plus className="mr-2 h-5 w-5" /> Agregar Miembro
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((staff) => (
          <div key={staff.id} className="bg-card border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                  <User className="h-8 w-8" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-lg truncate">{staff.user.name || "Sin nombre"}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {staff.user.email}
                  </p>
                  {staff.title && (
                    <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-lg bg-muted text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <Briefcase className="mr-1 h-3 w-3" /> {staff.title}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Servicios Asignados</p>
                <div className="flex flex-wrap gap-2">
                  {staff.services.length > 0 ? (
                    staff.services.map((s, i) => (
                      <span key={i} className="text-[10px] bg-accent text-accent-foreground px-2 py-1 rounded-md font-medium">
                        {s.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-muted-foreground italic">Sin servicios asignados</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t">
              <button className="flex-1 inline-flex h-10 items-center justify-center rounded-xl bg-muted/50 text-sm font-bold hover:bg-muted transition-all">
                Horarios
              </button>
              <button className="p-2 rounded-xl text-muted-foreground hover:bg-accent transition-all">
                <Edit className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleDelete(staff.id)}
                className="p-2 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        
        <button className="border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-muted-foreground hover:border-primary hover:text-primary transition-all hover:bg-primary/5 min-h-[250px] group">
          <div className="h-12 w-12 rounded-full border-2 border-dashed flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="h-6 w-6" />
          </div>
          <span className="font-bold">Agregar nuevo miembro</span>
        </button>
      </div>
    </div>
  );
}
