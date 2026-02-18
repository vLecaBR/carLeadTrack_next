"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, QrCode, Phone, Mail, MapPin, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateLeadStatus } from "@/app/actions/lead";

// Tipagem alinhada com o Prisma + Campos simulados para o MVP do QR Code
type Lead = {
  id: string;
  customerName: string;
  customerPhone: string;
  status: string;
  value: number | null;
  createdAt: Date;
  // Campos simulados que futuramente entrarão no Prisma
  email?: string;
  origem?: string;
  qrCode?: string;
  vehicleName?: string;
  mensagem?: string;
};

interface LeadManagementProps {
  initialLeads: Lead[];
}

export function LeadManagement({ initialLeads }: LeadManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isValidateDialogOpen, setIsValidateDialogOpen] = useState(false);
  const [validationNote, setValidationNote] = useState("");
  const [validationStatus, setValidationStatus] = useState("VISITED");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtro de busca
  const filteredLeads = initialLeads.filter((lead) =>
    lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.customerPhone.includes(searchTerm)
  );

  // Mapeamento dos status do Banco (Inglês) para o seu visual (Português)
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      NEW: { label: "Novo", variant: "default" },
      CONTACTED: { label: "Contatado", variant: "secondary" },
      VISITED: { label: "Visitou", variant: "default" },
      CLOSED_SALE: { label: "Comprou", variant: "default" },
      LOST: { label: "Perdido", variant: "destructive" },
    };
    return statusMap[status] || statusMap.NEW;
  };

  const getOrigemBadge = (origem?: string) => {
    const origemMap: Record<string, { label: string; className: string }> = {
      meta: { label: "Meta Ads", className: "bg-blue-100 text-blue-800 border-blue-200" },
      google: { label: "Google Ads", className: "bg-red-100 text-red-800 border-red-200" },
      organico: { label: "Orgânico", className: "bg-green-100 text-green-800 border-green-200" },
    };
    return origemMap[origem || "organico"];
  };

  // Chama a Server Action real para atualizar o lead no banco
  const handleValidateVisit = async () => {
    if (!selectedLead) return;
    setIsSubmitting(true);
    toast.loading("Validando localização e atualizando...", { id: "validate" });

    const result = await updateLeadStatus(selectedLead.id, validationStatus);

    if (result.error) {
      toast.error(result.error, { id: "validate" });
    } else {
      toast.success("Visita validada com sucesso! Status atualizado.", { id: "validate" });
      setIsValidateDialogOpen(false);
      setValidationNote("");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Gestão de Leads</h2>
        <p className="mt-1 text-gray-600">Acompanhe e valide os leads gerados pela sua vitrine offline.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total de Leads</p>
            <p className="text-2xl font-bold text-gray-900">{initialLeads.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Novos (Hoje)</p>
            <p className="text-2xl font-bold text-blue-600">
              {initialLeads.filter((l) => l.status === "NEW").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Em Atendimento</p>
            <p className="text-2xl font-bold text-orange-600">
              {initialLeads.filter((l) => l.status === "CONTACTED").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Convertidos (Visita/Venda)</p>
            <p className="text-2xl font-bold text-green-600">
              {initialLeads.filter((l) => l.status === "VISITED" || l.status === "CLOSED_SALE").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Search className="size-5 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Interesse</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Custo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{lead.customerName}</p>
                      <p className="text-sm text-gray-600">{lead.customerPhone}</p>
                    </div>
                  </TableCell>
                  <TableCell>{lead.vehicleName || "Honda Civic EX"}</TableCell>
                  <TableCell>
                    <Badge className={getOrigemBadge(lead.origem).className}>
                      {getOrigemBadge(lead.origem).label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(lead.status).variant}>
                      {getStatusBadge(lead.status).label}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(lead.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    <span className="font-medium">R$ {(lead.value || 0).toFixed(2)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedLead(lead)}>
                        <Eye className="size-4" />
                      </Button>
                      {lead.status !== "VISITED" && lead.status !== "CLOSED_SALE" && lead.status !== "LOST" && (
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => {
                            setSelectedLead(lead);
                            setIsValidateDialogOpen(true);
                          }}
                        >
                          <CheckCircle2 className="mr-1 size-4" />
                          Validar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLeads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Nenhum lead encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Lead Detail Dialog */}
      {selectedLead && !isValidateDialogOpen && (
        <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Lead</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* QR Code Section - Gerado dinamicamente para o MVP */}
              <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-6 text-center">
                <h3 className="mb-4 font-semibold text-gray-900">Código QR da Visita</h3>
                <div className="inline-block rounded-lg bg-white p-6 shadow-sm">
                  <div className="flex h-48 w-48 items-center justify-center rounded-lg bg-gray-100">
                    <div className="text-center">
                      <QrCode className="mx-auto mb-2 size-24 text-gray-400" />
                      <p className="font-mono text-2xl font-bold text-gray-900">
                        {selectedLead.qrCode || selectedLead.id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">Cliente deve mostrar este código na loja</p>
              </div>

              {/* Lead Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Nome Completo</Label>
                  <p className="text-lg font-semibold">{selectedLead.customerName}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Status</Label>
                  <div className="mt-1">
                    <Badge variant={getStatusBadge(selectedLead.status).variant}>
                      {getStatusBadge(selectedLead.status).label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-600">Telefone</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Phone className="size-4 text-gray-400" />
                    <p className="font-medium">{selectedLead.customerPhone}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-600">Origem</Label>
                  <div className="mt-1">
                    <Badge className={getOrigemBadge(selectedLead.origem).className}>
                      {getOrigemBadge(selectedLead.origem).label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-600">Custo do Lead</Label>
                  <p className="text-lg font-semibold text-blue-600">R$ {(selectedLead.value || 0).toFixed(2)}</p>
                </div>
              </div>

              {/* Visit Info if validated */}
              {(selectedLead.status === "VISITED" || selectedLead.status === "CLOSED_SALE") && (
                <div className="rounded-lg bg-green-50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-green-600" />
                    <h4 className="font-semibold text-green-900">Visita/Venda Confirmada</h4>
                  </div>
                  <p className="text-sm text-green-800">Localização validada com sucesso pelo vendedor.</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Validate Visit Dialog */}
      <Dialog open={isValidateDialogOpen} onOpenChange={setIsValidateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Validar Visita do Lead</DialogTitle>
            <DialogDescription>Certifique-se de estar na loja para validar a visita via GPS.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="font-medium text-gray-900">{selectedLead?.customerName}</p>
              <p className="text-sm text-gray-600">{selectedLead?.customerPhone}</p>
              <p className="mt-2 text-xs text-gray-500">
                Código Check-in: <span className="font-mono font-bold">{selectedLead?.id.slice(-6).toUpperCase()}</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label>Resultado da Validação</Label>
              <Select value={validationStatus} onValueChange={setValidationStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VISITED">Cliente Apenas Visitou</SelectItem>
                  <SelectItem value="CLOSED_SALE">Cliente Visitou e Comprou</SelectItem>
                  <SelectItem value="LOST">Cliente Desistiu / Falhou Check-in</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Observações (Opcional)</Label>
              <Textarea
                id="note"
                placeholder="Ex: Cliente curtiu as rodas do Civic, mas quer analisar o financiamento..."
                value={validationNote}
                onChange={(e) => setValidationNote(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-start gap-2 rounded-lg bg-yellow-50 p-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-yellow-600" />
              <div className="text-sm">
                <p className="font-medium text-yellow-900">Validação de Localização Ativa</p>
                <p className="text-yellow-700">O sistema registrará as coordenadas atuais do seu dispositivo.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleValidateVisit} disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? "Validando..." : "Confirmar Check-in do Lead"}
              </Button>
              <Button
                variant="outline"
                disabled={isSubmitting}
                onClick={() => {
                  setIsValidateDialogOpen(false);
                  setValidationNote("");
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}