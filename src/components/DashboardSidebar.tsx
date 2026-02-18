"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Car, Users as UsersIcon, UserCircle, Settings, LogOut, Store, ExternalLink, Bell, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

interface SidebarProps {
  user: {
    name: string;
    role: string;
    storeName?: string;
  };
}

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname(); // Pega a URL atual do Next.js
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isOwner = user.role === "OWNER" || user.role === "SUPER_ADMIN";
  const newLeadsCount = 0; // Futuramente buscaremos do banco

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, show: true, badge: null },
    { href: "/dashboard/estoque", label: "Estoque", icon: Car, show: true, badge: null },
    { href: "/dashboard/leads", label: "Leads", icon: UsersIcon, show: true, badge: newLeadsCount > 0 ? newLeadsCount : null },
    { href: "/dashboard/equipe", label: "Equipe", icon: UserCircle, show: isOwner, badge: null },
    { href: "/dashboard/configuracoes", label: "Configurações", icon: Settings, show: isOwner, badge: null },
  ];

  const handleViewStorefront = () => {
    toast.info("A vitrine pública será desenvolvida em breve!");
  };

  return (
    <>
      {/* Botão Mobile */}
      <button 
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 flex flex-col shadow-xl transition-transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-6 border-b border-gray-100 bg-linear-to-br from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl border border-white/30">
              <Car className="size-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-white truncate">{user.storeName || "Plataforma"}</h2>
              <p className="text-xs text-blue-100 truncate">Área Restrita</p>
            </div>
          </div>
          
          <Button 
            variant="secondary"
            size="sm" 
            className="w-full gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
            onClick={handleViewStorefront}
          >
            <Store className="size-4" />
            Ver Vitrine
            <ExternalLink className="size-3 ml-auto" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.filter(item => item.show).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium relative group ${
                  isActive
                    ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <item.icon className="size-5" />
                <span>{item.label}</span>
                {item.badge && (
                  <Badge className="ml-auto bg-red-500 text-white border-0">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 mb-3 p-3 bg-white rounded-xl border border-gray-100">
            <Avatar>
              <AvatarFallback className="bg-linear-to-br from-blue-600 to-indigo-600 text-white font-bold">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.role}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start gap-2 text-gray-600 hover:text-red-600 hover:bg-red-50"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="size-4" />
            Sair do Sistema
          </Button>
        </div>
      </aside>
    </>
  );
}