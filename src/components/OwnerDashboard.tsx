import { prisma } from "@/lib/prisma";
import { 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar
} from "lucide-react";

// O componente agora é assíncrono (Server Component)
export async function OwnerDashboard({ storeId, userName }: { storeId: string; userName: string }) {
  // 1. Buscando dados reais no banco de dados
  const leads = await prisma.lead.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });

  const availableVehiclesCount = await prisma.vehicle.count({
    where: { storeId, isAvailable: true },
  });

  // 2. Lógica de Negócio
  const now = new Date();
  const leadsThisMonth = leads.filter((l) => {
    const createdDate = new Date(l.createdAt);
    return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
  });

  const visitsCount = leads.filter((l) => l.status === "VISITED" || l.status === "CLOSED_SALE").length;
  
  const conversionRate = leadsThisMonth.length > 0 
    ? ((visitsCount / leadsThisMonth.length) * 100).toFixed(1)
    : "0.0";

  // Aqui usamos l.value em vez de custoLead, pois foi como modelamos no banco
  const totalInvested = leadsThisMonth.reduce((sum, lead) => sum + (lead.value || 0), 0);
  const avgCostPerLead = leadsThisMonth.length > 0
    ? (totalInvested / leadsThisMonth.length).toFixed(2)
    : "0.00";

  const recentLeads = leads.slice(0, 5);

  const stats = [
    {
      title: "Total de Leads",
      value: leadsThisMonth.length,
      change: "+12%",
      isPositive: true,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Visitas Confirmadas",
      value: visitsCount,
      change: "+8%",
      isPositive: true,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Taxa de Conversão",
      value: `${conversionRate}%`,
      change: "+3.2%",
      isPositive: true,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Custo por Lead",
      value: `R$ ${avgCostPerLead}`,
      change: "-5%",
      isPositive: false, // Alterado para false só para ver o icone vermelho de exemplo
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  // Mapeamento dos status do Prisma para a tela
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; classes: string }> = {
      NEW: { label: "Novo", classes: "bg-blue-100 text-blue-800 border-blue-200" },
      CONTACTED: { label: "Contatado", classes: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      VISITED: { label: "Visitou", classes: "bg-green-100 text-green-800 border-green-200" },
      CLOSED_SALE: { label: "Comprou", classes: "bg-emerald-100 text-emerald-800 border-emerald-200" },
      LOST: { label: "Perdido", classes: "bg-red-100 text-red-800 border-red-200" },
    };
    return statusMap[status] || statusMap.NEW;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bem-vindo, {userName}!</h1>
        <p className="mt-1 text-gray-600">Aqui está um resumo do desempenho da sua loja hoje.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-1 text-sm text-gray-600">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <div className="mt-2 flex items-center gap-1">
                  {stat.isPositive ? (
                    <ArrowUpRight className="size-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="size-4 text-red-600" />
                  )}
                  <span className={`text-sm ${stat.isPositive ? "text-green-600" : "text-red-600"}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500">vs mês anterior</span>
                </div>
              </div>
              <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                <stat.icon className={`size-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Leads */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="border-b p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <Users className="size-5" /> Leads Recentes
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentLeads.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum lead cadastrado ainda.</p>
              ) : (
                recentLeads.map((lead) => {
                  const badge = getStatusBadge(lead.status);
                  return (
                    <div key={lead.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{lead.customerName}</p>
                        <p className="text-sm text-gray-600">{lead.customerPhone}</p>
                      </div>
                      <div className="text-right">
                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badge.classes}`}>
                          {badge.label}
                        </span>
                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="border-b p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <Calendar className="size-5" /> Resumo do Mês
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
                <div>
                  <p className="text-sm text-gray-600">Veículos Disponíveis</p>
                  <p className="text-2xl font-bold text-gray-900">{availableVehiclesCount}</p>
                </div>
                <div className="rounded-lg bg-blue-600 p-3">
                  <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-green-50 p-4">
                <div>
                  <p className="text-sm text-gray-600">Investimento em Tráfego</p>
                  <p className="text-2xl font-bold text-gray-900">R$ {totalInvested.toFixed(2)}</p>
                </div>
                <div className="rounded-lg bg-green-600 p-3">
                  <DollarSign className="size-6 text-white" />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-purple-50 p-4">
                <div>
                  <p className="text-sm text-gray-600">ROI Estimado</p>
                  <p className="text-2xl font-bold text-gray-900">4.2x</p>
                </div>
                <div className="rounded-lg bg-purple-600 p-3">
                  <TrendingUp className="size-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}