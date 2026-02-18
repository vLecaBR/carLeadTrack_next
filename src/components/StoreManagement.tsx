"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, Search, Edit, Trash2, ExternalLink, Users, 
  Car, Target, MapPin, Phone, Building2, Mail, ShieldAlert, KeyRound
} from 'lucide-react';
import { toast } from 'sonner';
import { createStore, editStore, deleteStore, updateUserByAdmin } from '@/app/actions/store';

export function StoreManagement({ stores }: { stores: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modais de Loja
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any | null>(null);
  
  // Modal de Usuário
  const [isUserEditDialogOpen, setIsUserEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtro
  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.cnpj.includes(searchTerm)
  );

  // Handlers de Loja
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
    if (confirm(`ATENÇÃO: Excluir a loja ${store.name} apagará todos os carros, leads e usuários dela. Continuar?`)) {
      const result = await deleteStore(store.id);
      if (result.success) toast.success('Loja removida do sistema.');
      else toast.error(result.error);
    }
  };

  // Handler de Usuário
  const handleEditUserAction = async (formData: FormData) => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    const result = await updateUserByAdmin(selectedUser.id, formData);
    if (result.success) {
      toast.success('Usuário atualizado com sucesso!');
      setIsUserEditDialogOpen(false);
      setSelectedUser(null);
    } else {
      toast.error(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      {/* Header & Botão de Adicionar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Inquilinos</h1>
          <p className="text-gray-500 mt-1">Gerencie lojas, acessos e configurações globais.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 gap-2 h-12 px-6 rounded-xl transition-all">
              <Plus className="size-5" /> Cadastrar Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Cadastrar Lojista</DialogTitle>
              <DialogDescription>Crie o ambiente da loja e a conta do primeiro administrador.</DialogDescription>
            </DialogHeader>
            <form action={handleAddStoreAction} className="space-y-4 mt-4">
               <div className="grid grid-cols-2 gap-5">
                 <div className="col-span-2 space-y-2">
                   <Label className="text-gray-700 font-semibold">Nome Fantasia *</Label>
                   <Input name="name" placeholder="Ex: AutoLux Premium" className="h-11 bg-gray-50 border-gray-200" required />
                 </div>
                 <div className="space-y-2">
                   <Label className="text-gray-700 font-semibold">CNPJ *</Label>
                   <Input name="cnpj" placeholder="00.000.000/0001-00" className="h-11 bg-gray-50 border-gray-200" required />
                 </div>
                 <div className="space-y-2">
                   <Label className="text-gray-700 font-semibold">Slug (URL) *</Label>
                   <Input name="slug" placeholder="autolux" className="h-11 bg-gray-50 border-gray-200" required />
                 </div>
                 <div className="col-span-2 pt-4 border-t border-gray-100">
                   <p className="text-sm font-bold text-purple-600 mb-4 uppercase tracking-wider">Acesso do Proprietário</p>
                 </div>
                 <div className="space-y-2">
                   <Label className="text-gray-700 font-semibold">Nome Completo *</Label>
                   <Input name="ownerName" placeholder="João Silva" className="h-11 bg-gray-50 border-gray-200" required />
                 </div>
                 <div className="space-y-2">
                   <Label className="text-gray-700 font-semibold">E-mail (Login) *</Label>
                   <Input name="ownerEmail" type="email" placeholder="joao@email.com" className="h-11 bg-gray-50 border-gray-200" required />
                 </div>
                 <div className="col-span-2 space-y-2">
                   <Label className="text-gray-700 font-semibold">Senha Inicial *</Label>
                   <Input name="password" type="password" placeholder="••••••••" className="h-11 bg-gray-50 border-gray-200" required />
                 </div>
               </div>
               <div className="pt-6 mt-6">
                 <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg rounded-xl" disabled={isSubmitting}>
                   {isSubmitting ? "Criando ambiente..." : "Finalizar Cadastro"}
                 </Button>
               </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Barra de Busca */}
      <div className="relative group max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
        <Input 
          placeholder="Pesquisar por loja, slug ou CNPJ..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="pl-12 h-14 bg-white border-2 border-gray-100 focus:border-purple-300 rounded-2xl shadow-sm transition-all text-base"
        />
      </div>

      {/* Lista de Lojas (Cards Premium) */}
      <div className="grid grid-cols-1 gap-6">
        {filteredStores.map((store) => (
          <Card key={store.id} className="overflow-hidden border-2 border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 bg-white rounded-2xl">
            <div className="p-0">
              
              {/* Topo do Card com gradiente sutil */}
              <div className="flex flex-col md:flex-row justify-between gap-4 p-6 bg-linear-to-r from-gray-50/50 to-white border-b border-gray-100">
                <div className="flex items-start gap-5">
                  <div 
                    className="size-16 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0 border border-black/10"
                    style={{ backgroundColor: store.primaryColor || '#6b21a8' }}
                  >
                    <Building2 className="size-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{store.name}</h3>
                      <Badge className={store.subscriptionActive ? "bg-green-100 text-green-800 border-0" : "bg-red-100 text-red-800 border-0"}>
                        {store.subscriptionActive ? "Ativa" : "Bloqueada"}
                      </Badge>
                      <Badge variant="secondary" className="font-mono bg-gray-100 text-gray-700 border-0">{store.plan}</Badge>
                    </div>
                    <div className="flex items-center gap-5 text-sm text-gray-500 font-medium mt-2">
                      <span className="flex items-center gap-1.5"><Target className="size-4 text-gray-400" /> leadtrack.com.br/loja/<strong className="text-gray-700">{store.slug}</strong></span>
                      <span className="flex items-center gap-1.5"><Building2 className="size-4 text-gray-400" /> {store.cnpj}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" className="gap-2 bg-white hover:bg-gray-50 border-gray-200 rounded-xl h-10" onClick={() => window.open(`/loja/${store.slug}`, '_blank')}>
                    <ExternalLink className="size-4" /> Vitrine
                  </Button>
                  <Button variant="secondary" className="rounded-xl h-10 bg-purple-50 text-purple-700 hover:bg-purple-100" onClick={() => { setSelectedStore(store); setIsEditDialogOpen(true); }}>
                    <Edit className="size-4 mr-2" /> Editar Loja
                  </Button>
                  <Button variant="ghost" className="rounded-xl h-10 text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(store)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Grid Interno (Métricas, Contato, Equipe) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                
                {/* Coluna 1: Métricas */}
                <div className="p-6 space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Desempenho</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-center">
                      <Car className="size-5 text-blue-500 mx-auto mb-2" />
                      <p className="text-2xl font-black text-blue-900">{store._count?.vehicles || 0}</p>
                      <p className="text-xs font-semibold text-blue-600 uppercase mt-1">Carros</p>
                    </div>
                    <div className="p-4 bg-green-50/50 rounded-xl border border-green-100 text-center">
                      <Users className="size-5 text-green-500 mx-auto mb-2" />
                      <p className="text-2xl font-black text-green-900">{store._count?.leads || 0}</p>
                      <p className="text-xs font-semibold text-green-600 uppercase mt-1">Leads</p>
                    </div>
                  </div>
                </div>

                {/* Coluna 2: Contato */}
                <div className="p-6 space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contato da Loja</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="p-2 bg-white rounded-lg shadow-xs"><Phone className="size-4 text-purple-600" /></div>
                      <span className="text-sm font-medium text-gray-700">{store.phone || 'Não informado'}</span>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="p-2 bg-white rounded-lg shadow-xs mt-0.5"><MapPin className="size-4 text-purple-600" /></div>
                      <span className="text-sm font-medium text-gray-700 leading-relaxed">{store.address || 'Não informado'}</span>
                    </div>
                  </div>
                </div>

                {/* Coluna 3: Equipe (AGORA COM EDIÇÃO DE USUÁRIOS) */}
                <div className="p-6 space-y-4 bg-gray-50/30">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Usuários ({store.users?.length || 0})
                    </h4>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {store.users?.map((u: any) => (
                      <div key={u.id} className="group flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-sm transition-all">
                        <div className="flex items-center gap-3 overflow-hidden">
                           <div className="size-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0 text-sm">
                             {u.name.charAt(0).toUpperCase()}
                           </div>
                           <div className="min-w-0">
                             <p className="font-bold text-sm text-gray-900 truncate">{u.name}</p>
                             <p className="text-xs text-gray-500 truncate">{u.email}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="secondary" className={`text-[10px] ${u.role === 'OWNER' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'}`}>
                            {u.role === 'OWNER' ? 'Dono' : 'Vend'}
                          </Badge>
                          {/* Botão de Editar Usuário (Aparece no Hover) */}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="size-7 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-purple-600 hover:bg-purple-50"
                            onClick={() => {
                              setSelectedUser({ ...u, storeName: store.name });
                              setIsUserEditDialogOpen(true);
                            }}
                          >
                            <Edit className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {!store.users?.length && (
                      <div className="p-4 text-center border-2 border-dashed rounded-xl border-gray-200 text-gray-400 text-sm">
                        Nenhum usuário cadastrado.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </Card>
        ))}

        {filteredStores.length === 0 && (
          <div className="text-center py-20 bg-white border-2 border-dashed border-gray-200 rounded-3xl">
            <Building2 className="size-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-lg font-medium">Nenhuma loja encontrada.</p>
          </div>
        )}
      </div>

      {/* ====================================================== */}
      {/* MODAL DE EDIÇÃO DA LOJA (GERAL) */}
      {/* ====================================================== */}
      {selectedStore && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Editar Loja: {selectedStore.name}</DialogTitle>
              <DialogDescription>Ajuste as configurações globais deste inquilino.</DialogDescription>
            </DialogHeader>
            <form action={handleEditStoreAction} className="space-y-5 mt-4">
               <div className="grid grid-cols-2 gap-4">
                 <div className="col-span-2 space-y-2">
                   <Label className="font-semibold">Nome Fantasia</Label>
                   <Input name="nome" defaultValue={selectedStore.name} className="bg-gray-50" required />
                 </div>
                 <div className="space-y-2">
                   <Label className="font-semibold">CNPJ</Label>
                   <Input name="cnpj" defaultValue={selectedStore.cnpj} className="bg-gray-50" required />
                 </div>
                 <div className="space-y-2">
                   <Label className="font-semibold">Slug (URL)</Label>
                   <Input name="slug" defaultValue={selectedStore.slug} className="bg-gray-50 font-mono" required />
                 </div>
                 <div className="space-y-2">
                   <Label className="font-semibold">Plano Atual</Label>
                   <Select name="plano" defaultValue={selectedStore.plan}>
                     <SelectTrigger className="bg-gray-50"><SelectValue /></SelectTrigger>
                     <SelectContent>
                       <SelectItem value="FREE">Free</SelectItem>
                       <SelectItem value="PRO">Pro</SelectItem>
                       <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="space-y-2">
                   <Label className="font-semibold">Status de Acesso</Label>
                   <Select name="status" defaultValue={selectedStore.subscriptionActive ? "active" : "suspended"}>
                     <SelectTrigger className={selectedStore.subscriptionActive ? "bg-gray-50" : "bg-red-50 border-red-200 text-red-700 font-semibold"}>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="active">Ativa (Acesso Liberado)</SelectItem>
                       <SelectItem value="suspended">Suspensa (Bloqueado)</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 
                 <div className="col-span-2 pt-4 border-t border-gray-100">
                   <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Dados Opcionais</h4>
                 </div>

                 <div className="col-span-2 space-y-2">
                   <Label className="font-semibold">Endereço Físico</Label>
                   <Input name="endereco" defaultValue={selectedStore.address || ""} className="bg-gray-50" />
                 </div>
                 <div className="space-y-2">
                   <Label className="font-semibold">Telefone Público</Label>
                   <Input name="telefone" defaultValue={selectedStore.phone || ""} className="bg-gray-50" />
                 </div>
                 <div className="space-y-2">
                   <Label className="font-semibold">Cor da Marca (Hex)</Label>
                   <div className="flex gap-2">
                     <Input name="color" type="color" defaultValue={selectedStore.primaryColor || "#3b82f6"} className="w-16 h-10 p-1 cursor-pointer rounded-lg" />
                     <Input defaultValue={selectedStore.primaryColor || "#3b82f6"} disabled className="bg-gray-100 font-mono text-gray-500" />
                   </div>
                 </div>
               </div>
               <div className="flex gap-3 pt-6 border-t border-gray-100 mt-6">
                 <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 h-12 rounded-xl text-lg" disabled={isSubmitting}>
                   {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                 </Button>
                 <Button type="button" variant="outline" className="h-12 px-6 rounded-xl" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
               </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* ====================================================== */}
      {/* MODAL DE EDIÇÃO DE USUÁRIO ESPECÍFICO */}
      {/* ====================================================== */}
      {selectedUser && (
        <Dialog open={isUserEditDialogOpen} onOpenChange={setIsUserEditDialogOpen}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Users className="size-6 text-purple-600" />
                Editar Conta
              </DialogTitle>
              <DialogDescription>
                Atualizando dados do usuário vinculado à loja <strong>{selectedUser.storeName}</strong>.
              </DialogDescription>
            </DialogHeader>
            
            <form action={handleEditUserAction} className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label className="font-semibold">Nome Completo</Label>
                <Input name="name" defaultValue={selectedUser.name} className="h-11 bg-gray-50" required />
              </div>
              
              <div className="space-y-2">
                <Label className="font-semibold">E-mail (Usado para Login)</Label>
                <Input name="email" type="email" defaultValue={selectedUser.email} className="h-11 bg-gray-50" required />
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">Nível de Permissão</Label>
                <Select name="role" defaultValue={selectedUser.role}>
                  <SelectTrigger className="h-11 bg-gray-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OWNER">Proprietário (Acesso Total)</SelectItem>
                    <SelectItem value="SELLER">Vendedor (Acesso Limitado)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-yellow-50/50 border border-yellow-200 rounded-xl space-y-3 mt-4">
                <Label className="font-semibold text-yellow-800 flex items-center gap-2">
                  <KeyRound className="size-4" /> Forçar Nova Senha
                </Label>
                <Input 
                  name="password" 
                  type="password" 
                  placeholder="Deixe em branco para não alterar" 
                  className="bg-white border-yellow-300 focus-visible:ring-yellow-400 placeholder:text-yellow-600/50" 
                />
                <p className="text-xs text-yellow-700 leading-relaxed">
                  Se o usuário esqueceu a senha, digite uma nova aqui e informe a ele. Se deixar em branco, a senha atual será mantida.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 h-12 rounded-xl text-md" disabled={isSubmitting}>
                  {isSubmitting ? "Atualizando..." : "Salvar Usuário"}
                </Button>
                <Button type="button" variant="outline" className="h-12 px-6 rounded-xl" onClick={() => setIsUserEditDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}