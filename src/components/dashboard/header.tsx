"use client";

import { Bell, Search, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "../theme-toggle";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-16 border-b bg-background/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4 w-1/3">
        <div className="relative w-full max-w-sm hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button className="p-2 rounded-xl text-muted-foreground hover:bg-accent transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 h-2 w-2 bg-primary rounded-full border-2 border-background"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-2 border-l">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none">{session?.user?.name || "Usuario"}</p>
            <p className="text-xs text-muted-foreground mt-1 capitalize">{session?.user?.role?.toLowerCase() || "Rol"}</p>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center border transition-transform hover:scale-105 cursor-pointer">
            <User className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}
