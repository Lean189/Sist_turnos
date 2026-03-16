"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Calendar, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email o contraseña incorrectos");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-background p-10 rounded-3xl border shadow-xl animate-in fade-in zoom-in-95 duration-500">
        
        {registered && (
          <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-2xl text-primary text-sm font-bold animate-in bounce-in duration-500">
            <CheckCircle2 className="h-5 w-5" />
            ¡Negocio registrado! Ya puedes iniciar sesión.
          </div>
        )}

        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center mb-6 transition-transform hover:scale-110">
            <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Calendar className="h-7 w-7 text-white" />
            </div>
          </Link>
          <h2 className="text-3xl font-black tracking-tight text-foreground">
            Bienvenido de nuevo
          </h2>
          <p className="mt-2 text-sm text-muted-foreground font-medium">
            Ingresa tus credenciales para acceder a tu panel
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-2xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20 font-bold animate-in shake-x duration-300">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email-address" className="block text-sm font-bold text-foreground ml-1">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="w-full rounded-2xl border border-input bg-muted/30 px-4 py-3 text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-hidden focus:border-primary"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" dclassName="block text-sm font-bold text-foreground ml-1">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full rounded-2xl border border-input bg-muted/30 px-4 py-3 text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-hidden focus:border-primary"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary/20"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground font-medium">
                Recordarme
              </label>
            </div>

            <Link href="#" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground font-medium">
            ¿No tienes una cuenta?{" "}
            <Link href="/register-business" className="font-black text-primary hover:text-primary/80 transition-colors">
              Registra tu negocio
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
