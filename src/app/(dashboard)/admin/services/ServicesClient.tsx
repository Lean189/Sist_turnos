"use client";

import { useState, useTransition } from "react";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Clock,
  X,
  Loader2
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { createService, deleteService } from "@/app/actions/services";
import { serviceSchema } from "@/lib/validations";

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number | null;
}

interface ServicesClientProps {
  initialServices: Service[];
  businessId?: string | null;
}

export default function ServicesClient({ initialServices, businessId }: ServicesClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: 30,
    price: 0,
  });

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!businessId) {
      alert("No business ID found. Are you logged in?");
      return;
    }

    // Validar con Zod
    const validation = serviceSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      const result = await createService({
        ...formData,
        businessId,
      });

      if (result.success && result.service) {
        setServices([result.service as Service, ...services]);
        setIsModalOpen(false);
        setFormData({ name: "", description: "", duration: 30, price: 0 });
      } else {
        alert(result.error);
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este servicio?")) return;

    const result = await deleteService(id);
    if (result.success) {
      setServices(services.filter(s => s.id !== id));
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Servicios</h1>
          <p className="text-muted-foreground mt-1">Gestiona los servicios que ofrece tu negocio.</p>
        </div>
        <button 
          onClick={() => {
            setIsModalOpen(true);
            setErrors({});
          }}
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
        >
          <Plus className="mr-2 h-5 w-5" /> Nuevo Servicio
        </button>
      </div>

      <div className="bg-card border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/10">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar servicio..."
              className="w-full pl-10 pr-4 py-2 bg-background border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-hidden"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Servicio</th>
                <th className="px-6 py-4 font-bold">Duración</th>
                <th className="px-6 py-4 font-bold">Precio</th>
                <th className="px-6 py-4 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-muted/20 transition-colors group text-sm">
                  <td className="px-6 py-4">
                    <div className="font-bold text-foreground">{service.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{service.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {service.duration} min
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 font-bold text-primary">
                      {service.price ? formatCurrency(service.price) : "Gratis"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-xl text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(service.id)}
                        className="p-2 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <button className="p-2 rounded-xl text-muted-foreground hover:bg-accent group-hover:hidden transition-all">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredServices.length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold">No se encontraron servicios</h3>
            <p className="text-muted-foreground">Prueba ajustando tu búsqueda o crea uno nuevo.</p>
          </div>
        )}

        <div className="p-4 border-t bg-muted/5 flex items-center justify-between text-xs text-muted-foreground">
          <div>Mostrando {filteredServices.length} de {services.length} servicios</div>
        </div>
      </div>

      {/* Modal para Nuevo Servicio */}
      {isModalOpen && (
        <div className={cn(
          "fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        )}>
          <div className="bg-background border rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Nuevo Servicio</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 hover:bg-muted rounded-xl transition-colors"
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Nombre del Servicio</label>
                <input 
                  className={cn(
                    "w-full px-4 py-2 border rounded-xl bg-muted/10 focus:ring-2 focus:ring-primary/20 outline-hidden transition-all",
                    errors.name && "border-destructive ring-destructive/10"
                  )}
                  placeholder="Ej: Limpieza Dental"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <p className="text-xs text-destructive font-bold">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Descripción (opcional)</label>
                <textarea 
                  className="w-full px-4 py-2 border rounded-xl bg-muted/10 focus:ring-2 focus:ring-primary/20 outline-hidden transition-all min-h-[100px]"
                  placeholder="Describe qué incluye el servicio..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Duración (min)</label>
                  <input 
                    type="number"
                    className={cn(
                      "w-full px-4 py-2 border rounded-xl bg-muted/10 focus:ring-2 focus:ring-primary/20 outline-hidden transition-all",
                      errors.duration && "border-destructive ring-destructive/10"
                    )}
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  />
                  {errors.duration && <p className="text-xs text-destructive font-bold">{errors.duration}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Precio ($)</label>
                  <input 
                    type="number"
                    className={cn(
                      "w-full px-4 py-2 border rounded-xl bg-muted/10 focus:ring-2 focus:ring-primary/20 outline-hidden transition-all",
                      errors.price && "border-destructive ring-destructive/10"
                    )}
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  />
                  {errors.price && <p className="text-xs text-destructive font-bold">{errors.price}</p>}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border rounded-xl font-bold hover:bg-muted transition-all"
                >
                  Cancelar
                </button>
                <button 
                  disabled={isPending}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Guardar Servicio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
