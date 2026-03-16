import Link from "next/link";
import { Calendar, CheckCircle2, LayoutDashboard, Users, Clock, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <Link className="flex items-center justify-center transition-transform hover:scale-105" href="#">
          <Calendar className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold tracking-tight">SaaS Turnos</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">
            Características
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/login">
            Iniciar Sesión
          </Link>
          <Link 
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 hover:scale-105 active:scale-95" 
            href="/register"
          >
            Registrarse
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-linear-to-b from-primary/5 via-background to-background relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                  Gestión de Turnos <br className="hidden sm:inline" /> simplified para tu Negocio
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-2xl/relaxed">
                  La solución integral para clínicas, barberías, consultores y más. Automatiza tus reservas y enfócate en lo que importa: tus clientes.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95" 
                  href="/register"
                >
                  Empezar Ahora
                </Link>
                <Link 
                  className="inline-flex h-11 items-center justify-center rounded-full border border-input bg-background px-8 text-sm font-medium shadow-sm transition-all hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95" 
                  href="#features"
                >
                  Ver Demo
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4">Todo lo que necesitas para crecer</h2>
              <p className="text-muted-foreground md:text-xl">Potencia tu empresa con herramientas profesionales de gestión.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Multi-industria",
                  description: "Adaptable a cualquier negocio: salud, belleza, técnica o consultoría.",
                  icon: LayoutDashboard,
                },
                {
                  title: "Gestión de Staff",
                  description: "Asigna servicios y horarios específicos a cada miembro de tu equipo.",
                  icon: Users,
                },
                {
                  title: "Disponibilidad Real",
                  description: "Tus clientes ven los espacios libres en tiempo real de forma automática.",
                  icon: Clock,
                },
                {
                  title: "Panel de Analytics",
                  description: "Visualiza el rendimiento de tu negocio con gráficos y métricas clave.",
                  icon: ShieldCheck,
                },
                {
                  title: "Notificaciones",
                  description: "Recordatorios automáticos para reducir las inasistencias.",
                  icon: CheckCircle2,
                },
                {
                  title: "SaaS Multi-tenant",
                  description: "Gestiona múltiples sucursales o negocios desde una sola plataforma.",
                  icon: Calendar,
                }
              ].map((feature, i) => (
                <div key={i} className="flex flex-col p-8 bg-background rounded-3xl border shadow-sm transition-all hover:shadow-md hover:-translate-y-1 group">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-6">
          <p className="text-sm text-muted-foreground">
            © 2024 SaaS Turnos. Todos los derechos reservados.
          </p>
          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
              Términos de Servicio
            </Link>
            <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
              Privacidad
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
