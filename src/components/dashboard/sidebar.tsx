"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Calendar, 
  LayoutDashboard, 
  Users, 
  Settings, 
  Clock, 
  ChevronLeft, 
  LogOut,
  Bell,
  Search,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useState } from "react";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Servicios", href: "/admin/services", icon: CheckCircle2 },
  { name: "Personal", href: "/admin/staff", icon: Users },
  { name: "Horarios", href: "/admin/schedule", icon: Clock },
  { name: "Configuración", href: "/admin/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "relative flex flex-col border-r bg-card transition-all duration-300 ease-in-out h-screen",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="flex h-16 items-center px-6 border-b">
        <Link href="/admin" className="flex items-center gap-2 font-bold transition-transform hover:scale-105 overflow-hidden whitespace-nowrap">
          <Calendar className="h-6 w-6 text-primary shrink-0" />
          {!collapsed && <span className="text-xl tracking-tight">BizFlow</span>}
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", isActive ? "" : "group-hover:text-primary")} />
              {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
              {collapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md border shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-3 border-t">
        <button
          onClick={() => signOut()}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all group"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0 group-hover:translate-x-1 transition-transform" />
          {!collapsed && <span className="text-sm font-medium">Cerrar Sesión</span>}
        </button>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background flex items-center justify-center shadow-sm hover:bg-accent transition-colors z-10"
      >
        <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed ? "rotate-180" : "")} />
      </button>
    </div>
  );
}
