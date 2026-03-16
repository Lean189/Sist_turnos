"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  User, 
  Mail, 
  Lock, 
  Link as LinkIcon, 
  ArrowRight,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { businessRegistrationSchema } from "@/lib/validations";
import { registerBusiness } from "@/app/actions/auth";

export default function RegisterBusinessPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    businessName: "",
    slug: "",
    name: "",
    email: "",
    password: "",
  });

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setFormData({ ...formData, slug: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    // Validar con Zod
    const validation = businessRegistrationSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      const result = await registerBusiness(formData);
      if (result.success) {
        // Redirigir al login o dashboard con mensaje de éxito
        router.push("/login?registered=true");
      } else {
        setServerError(result.error || "Ocurrió un error");
      }
    });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Lado Izquierdo - Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary via-primary to-primary/80" />
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-black/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter">
            <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center shadow-lg">
              <div className="h-6 w-6 bg-primary rounded-lg flex items-center justify-center transform -rotate-12">
                <div className="h-3 w-3 bg-white rounded-full" />
              </div>
            </div>
            <span>TurnosPro</span>
          </Link>
        </div>

        <div className="relative z-10 mb-12">
          <h1 className="text-6xl font-black leading-[1.1] tracking-tight mb-6">
            Lleva tu negocio al <span className="text-white/70 italic">siguiente nivel.</span>
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-lg leading-relaxed">
            La plataforma de reservas más moderna para profesionales exigentes. 
            Regístrate en menos de 2 minutos.
          </p>
        </div>

        <div className="relative z-10 flex gap-12">
          <div className="space-y-1">
            <p className="text-3xl font-black">100%</p>
            <p className="text-sm text-primary-foreground/60 font-bold uppercase tracking-wider">Cloud Based</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black">24/7</p>
            <p className="text-sm text-primary-foreground/60 font-bold uppercase tracking-wider">Automatizado</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black">Free</p>
            <p className="text-sm text-primary-foreground/60 font-bold uppercase tracking-wider">Demo Mode</p>
          </div>
        </div>
      </div>

      {/* Lado Derecho - Formulario */}
      <div className="flex items-center justify-center p-8 lg:p-20">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tight">Crea tu cuenta</h2>
            <p className="text-muted-foreground font-medium">Empieza tu prueba gratuita hoy mismo.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {serverError && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm font-bold animate-in zoom-in-95 duration-200">
                {serverError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-bold flex items-center gap-2 ml-1">
                <Building2 className="h-4 w-4 text-primary" /> Nombre del Negocio
              </label>
              <input
                required
                className={cn(
                  "w-full px-5 py-3.5 bg-muted/30 border rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all outline-hidden text-sm",
                  errors.businessName ? "border-destructive ring-destructive/10" : "border-muted hover:border-muted-foreground/30 focus:border-primary"
                )}
                placeholder="Ej: Barbería Vintage"
                value={formData.businessName}
                onChange={e => setFormData({ ...formData, businessName: e.target.value })}
              />
              {errors.businessName && <p className="text-xs text-destructive font-bold ml-1">{errors.businessName}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold flex items-center gap-2 ml-1">
                <LinkIcon className="h-4 w-4 text-primary" /> URL de Reservas
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">turnospro.com/reserva/</span>
                <input
                  required
                  className={cn(
                    "w-full pl-44 pr-5 py-3.5 bg-muted/30 border rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all outline-hidden text-sm font-bold",
                    errors.slug ? "border-destructive ring-destructive/10" : "border-muted hover:border-muted-foreground/30 focus:border-primary"
                  )}
                  placeholder="tu-negocio"
                  value={formData.slug}
                  onChange={handleSlugChange}
                />
              </div>
              <p className="text-[10px] text-muted-foreground ml-1 uppercase tracking-widest font-bold">Sin espacios ni símbolos.</p>
              {errors.slug && <p className="text-xs text-destructive font-bold ml-1">{errors.slug}</p>}
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold flex items-center gap-2 ml-1">
                  <User className="h-4 w-4 text-primary" /> Nombre Completo
                </label>
                <input
                  required
                  className={cn(
                    "w-full px-5 py-3.5 bg-muted/30 border rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all outline-hidden text-sm",
                    errors.name ? "border-destructive ring-destructive/10" : "border-muted hover:border-muted-foreground/30 focus:border-primary"
                  )}
                  placeholder="Juan Pérez"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <p className="text-xs text-destructive font-bold ml-1">{errors.name}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold flex items-center gap-2 ml-1">
                <Mail className="h-4 w-4 text-primary" /> Correo Electrónico
              </label>
              <input
                type="email"
                required
                className={cn(
                  "w-full px-5 py-3.5 bg-muted/30 border rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all outline-hidden text-sm",
                  errors.email ? "border-destructive ring-destructive/10" : "border-muted hover:border-muted-foreground/30 focus:border-primary"
                )}
                placeholder="juan@ejemplo.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <p className="text-xs text-destructive font-bold ml-1">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold flex items-center gap-2 ml-1">
                <Lock className="h-4 w-4 text-primary" /> Contraseña
              </label>
              <input
                type="password"
                required
                className={cn(
                  "w-full px-5 py-3.5 bg-muted/30 border rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all outline-hidden text-sm",
                  errors.password ? "border-destructive ring-destructive/10" : "border-muted hover:border-muted-foreground/30 focus:border-primary"
                )}
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
              {errors.password && <p className="text-xs text-destructive font-bold ml-1">{errors.password}</p>}
            </div>

            <button
              disabled={isPending}
              className="w-full bg-primary text-primary-foreground h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 group"
            >
              {isPending ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  Crear Negocio <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground font-medium">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-primary font-black hover:underline underline-offset-4">
              Inicia Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
