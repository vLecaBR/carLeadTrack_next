"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Users, TrendingUp, DollarSign, Activity } from "lucide-react";

interface AdminHomeProps {
  userName: string;
  stats: {
    totalStores: number;
    activeStores: number;
    storesList: any[];
    totalUsers: number;
    totalLeads: number;
    leadsConvertidos: number;
    leadsPendentes: number;
    vendasFechadas: number;
  };
}

export function AdminHome({ userName, stats }: AdminHomeProps) {
  // Cálculos dinâmicos
  const conversionRate = stats.totalLeads > 0 
    ? ((stats.leadsConvertidos / stats.totalLeads) * 100).toFixed(1) 
    : "0.0";
    
  // Regra de negócio: R$15 por lead convertido validado + Mensalidade do plano
  const revenueLeads = stats.leadsConvertidos * 15; 
  const revenueMensalidade = stats.totalStores * 97;
  const totalRevenue = revenueLeads + revenueMensalidade;

  const dashboardCards = [
    {
      title: "Total de Lojas",
      value: stats.totalStores,
      subtitle: `${stats.activeStores} ativas`,
      icon: Store,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total de Leads",
      value: stats.totalLeads,
      subtitle: `${stats.leadsConvertidos} convertidos`,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Taxa de Conversão",
      value: `${conversionRate}%`,
      subtitle: "Média geral do sistema",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Receita (MRR + Leads)",
      value: `R$ ${totalRevenue.toLocaleString('pt-BR')}`,
      subtitle: "Faturamento estimado",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bem-vindo, {userName}!
        </h1>
        <p className="mt-1 text-gray-600">
          Visão geral do faturamento e uso do sistema LeadTrack.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((stat, index) => (
          <Card key={index} className="border-2 hover:border-gray-300 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-1 text-sm font-semibold text-gray-600 uppercase tracking-wider">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="mt-2 text-sm text-gray-500 font-medium">{stat.subtitle}</p>
                </div>
                <div className={`rounded-xl p-3 ${stat.bgColor}`}>
                  <stat.icon className={`size-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Lojas */}
        <Card className="border-2 shadow-sm">
          <CardHeader className="bg-gray-50/50 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Store className="size-5 text-gray-500" />
              Lojas Cadastradas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y max-h-75 overflow-auto">
              {stats.storesList.map((tenant) => (
                <div key={tenant.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-bold text-gray-900">{tenant.name}</p>
                    <a href={`/loja/${tenant.slug}`} target="_blank" className="text-sm text-blue-600 hover:underline">
                      {tenant.slug}.leadtrack.com.br
                    </a>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      tenant.subscriptionActive ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {tenant.subscriptionActive ? "Ativa" : "Bloqueada"}
                    </span>
                    <p className="mt-1 text-xs font-semibold text-gray-500">{tenant.plan}</p>
                  </div>
                </div>
              ))}
              {stats.storesList.length === 0 && (
                <p className="p-8 text-center text-gray-500">Nenhuma loja cadastrada ainda.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity & System Info (Agrupados) */}
        <div className="space-y-6">
          <Card className="border-2 shadow-sm">
            <CardHeader className="bg-gray-50/50 border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="size-5 text-gray-500" />
                Saúde do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-gray-50 p-4 text-center border">
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                  <p className="text-sm font-medium text-gray-600 mt-1">Vendedores Ativos</p>
                </div>
                <div className="rounded-xl bg-blue-50 p-4 text-center border border-blue-100">
                  <p className="text-3xl font-bold text-blue-700">{stats.leadsPendentes}</p>
                  <p className="text-sm font-medium text-blue-800 mt-1">Leads Pendentes</p>
                </div>
                <div className="rounded-xl bg-green-50 p-4 text-center border border-green-100 col-span-2">
                  <p className="text-3xl font-bold text-green-700">{stats.vendasFechadas}</p>
                  <p className="text-sm font-medium text-green-800 mt-1">Carros Vendidos (Mês)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}