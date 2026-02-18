"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Car, Users as UsersIcon, UserCircle, Settings, LogOut, Store, ExternalLink, Menu, X, Shield, Trello } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

interface SidebarProps {
  user: {
    name: string;
    role: string;
    storeName?: string;
    storeSlug?: string | null;
  };
}

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isSuperAdmin = user.role === "SUPER_ADMIN";
  const isOwner = user.role === "OWNER" || isSuperAdmin;
  
  // Cores dinâmicas: Roxo pro Admin, Azul pro Lojista
  const themeColors = isSuperAdmin 
    ? "bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 border-purple-700/50" 
    : "bg-white border-gray-200";
    
  const textColors = isSuperAdmin ? "text-white" : "text-gray-900";
  const linkHoverColor = isSuperAdmin ? "text-purple-100 hover:bg-purple-800/50" : "text-gray-600 hover:bg-blue-50 hover:text-blue-600";
  const linkActiveColor = isSuperAdmin ? "bg-white text-purple-900 shadow-xl" : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30";

  // Menu Inteligente que se adapta ao perfil
  const menuItems = [
    { href: "/dashboard", label: isSuperAdmin ? "Dashboard Geral" : "Dashboard", icon: LayoutDashboard, show: true },
    
    // Menus Exclusivos da Loja
    { href: "/dashboard/estoque", label: "Estoque", icon: Car, show: !isSuperAdmin },
    { href: "/dashboard/leads", label: "Leads", icon: UsersIcon, show: !isSuperAdmin },
    { href: "/dashboard/equipe", label: "Equipe", icon: UserCircle, show: isOwner && !isSuperAdmin },
    { href: "/dashboard/configuracoes", label: "Configurações", icon: Settings, show: isOwner && !isSuperAdmin },

    // Menus Exclusivos do Admin SaaS
    { href: "/dashboard/lojas", label: "Lojas Clientes", icon: Store, show: isSuperAdmin },
    { href: "/dashboard/leads-globais", label: "Leads Globais", icon: Trello, show: isSuperAdmin },
  ];

  const handleViewStorefront = () => {
    if (user.storeSlug) {
      window.open(`/loja/${user.storeSlug}`, "_blank");
    } else {
      toast.error("Você precisa configurar a loja primeiro!");
    }
  };

  return (
    <>
      <button 
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md text-gray-900"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      <aside className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 ${themeColors} flex flex-col shadow-xl transition-transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        
        {/* Topo da Sidebar (Cabeçalho) */}
        <div className={`p-6 border-b ${isSuperAdmin ? "border-purple-700/50" : "border-gray-100 bg-gradient-to-br from-blue-600 to-indigo-600 text-white"}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl border border-white/30">
              {isSuperAdmin ? <Shield className="size-6 text-white" /> : <Car className="size-6 text-white" />}
            </div>
            <div className="flex-1 min-w-0 text-white">
              <h2 className="font-bold truncate">{isSuperAdmin ? "Admin LeadTrack" : (user.storeName || "Plataforma")}</h2>
              <p className="text-xs truncate opacity-80">{isSuperAdmin ? "Painel Administrativo" : "Área Restrita"}</p>
            </div>
          </div>
          
          {!isSuperAdmin && (
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
          )}
        </div>

        {/* Links de Navegação */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.filter(item => item.show).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium relative group ${isActive ? linkActiveColor : linkHoverColor}`}
              >
                <item.icon className="size-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Rodapé do Usuário */}
        <div className={`p-4 border-t ${isSuperAdmin ? "border-purple-700/50" : "border-gray-100 bg-gray-50/50"}`}>
          <div className={`flex items-center gap-3 mb-3 p-3 rounded-xl border ${isSuperAdmin ? "bg-white/10 border-white/20 text-white" : "bg-white border-gray-100 text-gray-900"}`}>
            <Avatar>
              <AvatarFallback className={`font-bold ${isSuperAdmin ? "bg-white text-purple-900" : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"}`}>
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className={`text-xs truncate ${isSuperAdmin ? "text-purple-200" : "text-gray-500"}`}>{isSuperAdmin ? "Administrador" : user.role}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`w-full justify-start gap-2 ${isSuperAdmin ? "text-purple-100 hover:bg-purple-800/50 hover:text-white" : "text-gray-600 hover:text-red-600 hover:bg-red-50"}`}
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