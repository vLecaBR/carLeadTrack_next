"use client";

import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Phone, Calendar, DollarSign, Store } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { updateLeadStatus } from '@/app/actions/lead';

// Nossos status reais do Prisma
const LEAD_STATUSES = [
  { id: 'NEW', label: 'Novos', color: 'bg-blue-500' },
  { id: 'CONTACTED', label: 'Contatados', color: 'bg-yellow-500' },
  { id: 'SCHEDULED', label: 'Agendados', color: 'bg-orange-500' },
  { id: 'VISITED', label: 'Visitaram', color: 'bg-green-500' },
  { id: 'CLOSED_SALE', label: 'Compraram', color: 'bg-purple-500' },
  { id: 'LOST', label: 'Perdidos', color: 'bg-red-500' }
];

interface LeadCardProps {
  lead: any;
  onDragEnd: (leadId: string, newStatus: string) => void;
  onClick: (lead: any) => void;
}

function LeadCard({ lead, onDragEnd, onClick }: LeadCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'LEAD',
    item: { id: lead.id, currentStatus: lead.status },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<{ status: string }>();
      if (item && dropResult) {
        onDragEnd(item.id, dropResult.status);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  // O Prisma nos envia a loja aninhada (store.name)
  const storeName = lead.store?.name || "Loja Desconhecida";

  return (
    <div
      // CORREÇÃO AQUI: Passando o node explicitamente para evitar erro de tipo
      ref={(node) => { drag(node); }}
      onClick={() => onClick(lead)}
      className={`bg-white p-3 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-purple-200 transition-all cursor-pointer ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-bold text-gray-900 text-sm truncate pr-2">{lead.customerName}</h4>
        <Badge variant="secondary" className="text-[10px] bg-purple-50 text-purple-700 shrink-0">
          ORGÂNICO
        </Badge>
      </div>
      
      <div className="space-y-2 text-xs text-gray-600 mb-3">
        <div className="flex items-center gap-2">
          <Phone className="size-3 text-gray-400" />
          <span className="font-medium">{lead.customerPhone}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <span className="text-xs font-semibold text-gray-500 flex items-center gap-1 truncate pr-2">
          <Store className="size-3 text-purple-400" /> {storeName}
        </span>
        <span className="text-xs font-bold text-green-600 shrink-0">
          R$ {(lead.value || 0).toFixed(2)}
        </span>
      </div>
    </div>
  );
}

interface ColumnProps {
  status: typeof LEAD_STATUSES[0];
  leads: any[];
  onDrop: (leadId: string, newStatus: string) => void;
  onLeadClick: (lead: any) => void;
}

function Column({ status, leads, onDrop, onLeadClick }: ColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'LEAD',
    drop: () => ({ status: status.id }),
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));

  const columnLeads = leads.filter(lead => lead.status === status.id);
  const totalValue = columnLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);

  return (
    <div
      // CORREÇÃO AQUI TAMBÉM: Para o drop funcionar sem reclamar
      ref={(node) => { drop(node); }}
      className={`flex-shrink-0 w-80 ${isOver ? 'bg-purple-50/50 border-purple-200' : 'bg-gray-50/50 border-transparent'} border-2 rounded-2xl p-4 transition-colors flex flex-col h-[calc(100vh-280px)]`}
    >
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full shadow-sm ${status.color}`}></div>
          <h3 className="font-bold text-gray-800 tracking-tight">{status.label}</h3>
          <Badge variant="secondary" className="ml-auto bg-white text-gray-600 font-bold shadow-sm">
            {columnLeads.length}
          </Badge>
        </div>
        <p className="text-xs font-medium text-gray-500">
          Potencial: R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 custom-scrollbar pr-2 pb-4">
        {columnLeads.map(lead => (
          <LeadCard 
            key={lead.id} 
            lead={lead} 
            onDragEnd={onDrop}
            onClick={onLeadClick}
          />
        ))}
        
        {columnLeads.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
            <p className="text-sm font-medium">Solte leads aqui</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminLeadsKanban({ initialLeads }: { initialLeads: any[] }) {
  // Estado local para a movimentação instantânea (Optimistic UI)
  const [leads, setLeads] = useState<any[]>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  const handleDrop = async (leadId: string, newStatus: string) => {
    // 1. Atualiza visualmente primeiro (muito rápido)
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
    
    // 2. Avisa o usuário
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      const statusLabel = LEAD_STATUSES.find(s => s.id === newStatus)?.label;
      toast.success(`${lead.customerName} movido para ${statusLabel}`);
    }

    // 3. Atualiza no banco de dados de verdade em segundo plano
    await updateLeadStatus(leadId, newStatus);
  };

  const totalLeads = leads.length;
  const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  const convertedLeads = leads.filter(l => l.status === 'VISITED' || l.status === 'CLOSED_SALE').length;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0.0';

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        
        {/* Header e Alerta */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Leads Globais</h1>
            <p className="text-gray-500 mt-1">Supervisione o funil de vendas de todas as lojas da plataforma.</p>
          </div>
          <Badge className="bg-purple-100 text-purple-800 border-purple-200 px-4 py-2 text-sm shadow-inner">
            <Store className="size-4 mr-2" /> Modo Administrador
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-2 border-gray-100 shadow-sm">
            <CardContent className="p-5 text-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Leads Totais</p>
              <p className="text-3xl font-black text-gray-900 mt-1">{totalLeads}</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-gray-100 shadow-sm">
            <CardContent className="p-5 text-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Convertidos</p>
              <p className="text-3xl font-black text-green-600 mt-1">{convertedLeads}</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-gray-100 shadow-sm">
            <CardContent className="p-5 text-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Taxa de Sucesso</p>
              <p className="text-3xl font-black text-purple-600 mt-1">{conversionRate}%</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-gray-100 shadow-sm bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-5 text-center">
              <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Receita Potencial</p>
              <p className="text-3xl font-black text-blue-700 mt-1">R$ {totalValue.toLocaleString('pt-BR')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Kanban Board */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {LEAD_STATUSES.map(status => (
              <Column
                key={status.id}
                status={status}
                leads={leads}
                onDrop={handleDrop}
                onLeadClick={setSelectedLead}
              />
            ))}
          </div>
        </div>

        {/* Modal de Detalhes do Lead */}
        {selectedLead && (
          <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
            <DialogContent className="max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Ficha do Lead</DialogTitle>
                <DialogDescription>Detalhes do cliente e origem do contato.</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Status Atual</p>
                    <Badge className={`mt-1 text-sm ${LEAD_STATUSES.find(s => s.id === selectedLead.status)?.color}`}>
                      {LEAD_STATUSES.find(s => s.id === selectedLead.status)?.label}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-500 uppercase">Custo / Valor</p>
                    <p className="text-lg font-black text-green-600">R$ {(selectedLead.value || 0).toFixed(2)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-xs font-bold text-gray-400 uppercase">Cliente</Label>
                    <p className="text-base font-semibold text-gray-900 mt-1">{selectedLead.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-gray-400 uppercase">Telefone</Label>
                    <div className="flex items-center gap-2 mt-1 text-gray-700">
                      <Phone className="size-4" />
                      <p className="font-medium">{selectedLead.customerPhone}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-gray-400 uppercase">Data de Entrada</Label>
                    <div className="flex items-center gap-2 mt-1 text-gray-700">
                      <Calendar className="size-4" />
                      <p className="font-medium">
                        {new Date(selectedLead.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-gray-400 uppercase">Loja Responsável</Label>
                    <div className="flex items-center gap-2 mt-1 text-purple-700 bg-purple-50 px-2 py-1 rounded-md w-fit">
                      <Store className="size-4" />
                      <p className="font-bold text-sm truncate max-w-[120px]">
                        {selectedLead.store?.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col items-center text-center">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">ID de Validação (QR Code)</p>
                  <p className="text-3xl font-mono font-black text-blue-900 mt-2 tracking-widest">
                    {selectedLead.id.slice(-6).toUpperCase()}
                  </p>
                </div>

              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DndProvider>
  );
}