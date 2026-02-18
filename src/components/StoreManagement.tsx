"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// IMPORTAÇÃO CORRIGIDA AQUI (Adicionado o DialogDescription)
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, Search, Edit, Trash2, ExternalLink, Users, 
  Car, Target, MapPin, Phone, Building2, Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { createStore, editStore, deleteStore } from '@/app/actions/store';

export function StoreManagement({ stores }: { stores: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtro de busca
  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.cnpj.includes(searchTerm)
  );

  // Actions
  const handleAddStoreAction = async (formData: FormData) => {
    setIsSubmitting(true);
    const result = await createStore(formData);
    if (result.success) {
      toast.success('Loja criada com sucesso!');
      setIsAddDialogOpen(false);
    } else {
      toast.error(result.error);
    }
    setIsSubmitting(false);
  };

  const handleEditStoreAction = async (formData: FormData) => {
    if (!selectedStore) return;
    setIsSubmitting(true);
    const result = await editStore(selectedStore.id, formData);
    if (result.success) {
      toast.success('Loja atualizada!');
      setIsEditDialogOpen(false);
      setSelectedStore(null);
    } else {
      toast.error(result.error);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (store: any) => {
    if (confirm(`AVISO: Excluir a loja ${store.name} apagará todos os carros e leads dela. Continuar?`)) {
      const result = await deleteStore(store.id);
      if (result.success) toast.success('Loja removida do sistema.');
      else toast.error(result.error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Botão de Adicionar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Gestão de Inquilinos</h1>
          <p className="text-gray-500 mt-1">Administre as lojas e equipes do ecossistema LeadTrack.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 gap-2 h-11 px-6">
              <Plus className="size-4" /> Cadastrar Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Cadastrar Lojista</DialogTitle>
              <DialogDescription>Crie um novo ambiente de loja e o acesso do proprietário.</DialogDescription>
            </DialogHeader>
            <form action={handleAddStoreAction} className="space-y-4 mt-4">
               <div className="grid grid-cols-2 gap-4">
                 <div className="col-span-2 space-y-2">
                   <Label>Nome Fantasia *</Label>
                   <Input name="name" placeholder="Ex: AutoLux Premium" required />
                 </div>
                 <div className="space-y-2">
                   <Label>CNPJ *</Label>
                   <Input name="cnpj" placeholder="00.000.000/0001-00" required />
                 </div>
                 <div className="space-y-2">
                   <Label>Slug (URL) *</Label>
                   <Input name="slug" placeholder="autolux" required />
                 </div>
                 <div className="space-y-2">
                   <Label>Nome do Dono *</Label>
                   <Input name="ownerName" placeholder="João Silva" required />
                 </div>
                 <div className="space-y-2">
                   <Label>E-mail do Dono (Login) *</Label>
                   <Input name="ownerEmail" type="email" placeholder="joao@email.com" required />
                 </div>
                 <div className="col-span-2 space-y-2">
                   <Label>Senha Inicial *</Label>
                   <Input name="password" type="password" placeholder="••••••••" required />
                 </div>
               </div>
               <div className="pt-4 border-t mt-4">
                 <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg" disabled={isSubmitting}>
                   {isSubmitting ? "Criando ambiente..." : "Finalizar Cadastro"}
                 </Button>
               </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Barra de Busca */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
        <Input 
          placeholder="Pesquisar por nome da loja, slug ou CNPJ..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="pl-12 h-14 bg-white border-2 border-gray-100 focus:border-purple-200 rounded-2xl shadow-sm transition-all text-lg"
        />
      </div>

      {/* Lista de Lojas em Cards Detalhados */}
      <div className="grid grid-cols-1 gap-6">
        {filteredStores.map((store) => (
          <Card key={store.id} className="overflow-hidden border-2 border-gray-100 hover:border-purple-200 transition-all shadow-sm group">
            <div className="p-6">
              
              {/* Header do Card: Identidade e Status */}
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-start gap-4">
                  <div 
                    className="size-16 rounded-2xl flex items-center justify-center text-white shadow-inner shrink-0"
                    style={{ backgroundColor: store.primaryColor || '#6b21a8' }}
                  >
                    <Building2 className="size-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <h3 className="text-2xl font-bold text-gray-900">{store.name}</h3>
                      <Badge className={store.subscriptionActive ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}>
                        {store.subscriptionActive ? "Assinatura Ativa" : "Bloqueada"}
                      </Badge>
                      <Badge variant="outline" className="font-mono bg-white">{store.plan}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                      <span className="flex items-center gap-1.5"><Target className="size-4" /> {store.slug}</span>
                      <span className="flex items-center gap-1.5"><Building2 className="size-4" /> {store.cnpj}</span>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação do Card */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => window.open(`/loja/${store.slug}`, '_blank')} className="gap-2">
                    <ExternalLink className="size-4" /> Vitrine
                  </Button>
                  <Button variant="secondary" onClick={() => { setSelectedStore(store); setIsEditDialogOpen(true); }}>
                    <Edit className="size-4" /> 
                  </Button>
                  <Button variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(store)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Informações Agrupadas em Colunas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Coluna 1: Métricas de Operação */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    Operação
                  </h4>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Car className="size-5 text-blue-500" />
                        <span className="font-medium">Veículos no Estoque</span>
                      </div>
                      <span className="font-bold text-lg">{store._count?.vehicles || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Users className="size-5 text-green-500" />
                        <span className="font-medium">Leads Gerados</span>
                      </div>
                      <span className="font-bold text-lg">{store._count?.leads || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Coluna 2: Informações de Contato */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Contato & Localização
                  </h4>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                    <p className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                      <span className="p-1.5 bg-white rounded shadow-sm flex items-center justify-center"><Phone className="size-4 text-purple-600" /></span>
                      {store.phone || 'Sem telefone cadastrado'}
                    </p>
                    <p className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                      <span className="p-1.5 bg-white rounded shadow-sm mt-0.5 flex items-center justify-center"><MapPin className="size-4 text-purple-600" /></span>
                      <span className="leading-snug">{store.address || 'Endereço não configurado pelo lojista'}</span>
                    </p>
                  </div>
                </div>

                {/* Coluna 3: Lista de Usuários (Equipe) */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center justify-between">
                    Equipe ({store.users?.length || 0})
                  </h4>
                  <div className="max-h-[120px] overflow-y-auto space-y-2 pr-2">
                    {store.users?.map((u: any) => (
                      <div key={u.id} className="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-lg hover:border-purple-200 transition-colors">
                        <div className="flex items-center gap-3 overflow-hidden">
                           <div className="size-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0">
                             {u.name.charAt(0).toUpperCase()}
                           </div>
                           <div className="min-w-0">
                             <p className="font-semibold text-sm text-gray-900 truncate">{u.name}</p>
                             <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                               <Mail className="size-3" /> {u.email}
                             </p>
                           </div>
                        </div>
                        <Badge variant="secondary" className={`text-[10px] shrink-0 ${u.role === 'OWNER' ? 'bg-purple-100 text-purple-800' : ''}`}>
                          {u.role === 'OWNER' ? 'Dono' : 'Vendedor'}
                        </Badge>
                      </div>
                    ))}
                    {!store.users?.length && (
                      <div className="p-4 text-center border-2 border-dashed rounded-xl border-gray-200 text-gray-400 text-sm">
                        Nenhum usuário.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </Card>
        ))}

        {filteredStores.length === 0 && (
          <div className="text-center py-16 bg-white border-2 border-dashed rounded-2xl">
            <Building2 className="size-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-lg">Nenhuma loja encontrada na sua busca.</p>
          </div>
        )}
      </div>

      {/* Modal de Edição (Geral) */}
      {selectedStore && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Editar Configurações: {selectedStore.name}</DialogTitle>
              <DialogDescription>Altere plano, status e dados contratuais da loja.</DialogDescription>
            </DialogHeader>
            <form action={handleEditStoreAction} className="space-y-4 mt-4">
               <div className="grid grid-cols-2 gap-4">
                 <div className="col-span-2 space-y-2">
                   <Label>Nome Fantasia</Label>
                   <Input name="nome" defaultValue={selectedStore.name} required />
                 </div>
                 <div className="space-y-2">
                   <Label>CNPJ</Label>
                   <Input name="cnpj" defaultValue={selectedStore.cnpj} required />
                 </div>
                 <div className="space-y-2">
                   <Label>Slug (Domínio)</Label>
                   <Input name="slug" defaultValue={selectedStore.slug} required />
                 </div>
                 <div className="space-y-2">
                   <Label>Plano Atual</Label>
                   <Select name="plano" defaultValue={selectedStore.plan}>
                     <SelectTrigger><SelectValue /></SelectTrigger>
                     <SelectContent>
                       <SelectItem value="FREE">Free</SelectItem>
                       <SelectItem value="PRO">Pro</SelectItem>
                       <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="space-y-2">
                   <Label>Status de Acesso</Label>
                   <Select name="status" defaultValue={selectedStore.subscriptionActive ? "active" : "suspended"}>
                     <SelectTrigger className={selectedStore.subscriptionActive ? "" : "border-red-300 text-red-700"}>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="active">Ativa (Acesso Liberado)</SelectItem>
                       <SelectItem value="suspended">Suspensa (Bloqueado)</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 
                 <div className="col-span-2 pt-4 border-t">
                   <h4 className="text-sm font-bold text-gray-500 uppercase mb-4">Dados Opcionais (Preenchidos pelo Lojista)</h4>
                 </div>

                 <div className="col-span-2 space-y-2">
                   <Label>Endereço Físico</Label>
                   <Input name="endereco" defaultValue={selectedStore.address || ""} />
                 </div>
                 <div className="space-y-2">
                   <Label>Telefone Público</Label>
                   <Input name="telefone" defaultValue={selectedStore.phone || ""} />
                 </div>
                 <div className="space-y-2">
                   <Label>Cor da Marca (Hex)</Label>
                   <div className="flex gap-2">
                     <Input name="color" type="color" defaultValue={selectedStore.primaryColor || "#3b82f6"} className="w-16 p-1 cursor-pointer" />
                     <Input defaultValue={selectedStore.primaryColor || "#3b82f6"} disabled className="bg-gray-50 font-mono" />
                   </div>
                 </div>
               </div>
               <div className="flex gap-3 pt-6 border-t mt-6">
                 <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
                   {isSubmitting ? "Salvando..." : "Salvar Alterações Globais"}
                 </Button>
                 <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
               </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}