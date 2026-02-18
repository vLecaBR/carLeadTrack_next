"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Edit, Trash2, ExternalLink, Eye, Ban, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createStore, editStore, deleteStore } from '@/app/actions/store';

export function StoreManagement({ stores }: { stores: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers Reais
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
    if (confirm(`AVISO: Isso excluirá permanentemente a loja ${store.name}. Continuar?`)) {
      const result = await deleteStore(store.id);
      if (result.success) toast.success('Loja removida.');
      else toast.error(result.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Lojas</h1>
          <p className="text-gray-600 mt-1">Controle total dos inquilinos da plataforma</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
              <Plus className="size-4" /> Nova Loja
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cadastrar Lojista</DialogTitle>
            </DialogHeader>
            <form action={handleAddStoreAction} className="space-y-4">
               {/* Grid de inputs idêntico ao seu layout */}
               <div className="grid grid-cols-2 gap-4">
                 <div className="col-span-2 space-y-2">
                   <Label>Nome Fantasia *</Label>
                   <Input name="name" placeholder="Ex: AutoLux" required />
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
                   <Label>E-mail do Dono *</Label>
                   <Input name="ownerEmail" type="email" placeholder="joao@email.com" required />
                 </div>
                 <div className="col-span-2 space-y-2">
                   <Label>Senha Inicial *</Label>
                   <Input name="password" type="password" required />
                 </div>
               </div>
               <Button type="submit" className="w-full" disabled={isSubmitting}>
                 {isSubmitting ? "Criando..." : "Finalizar Cadastro"}
               </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Barra de Busca */}
      <Card><CardContent className="p-4 flex items-center gap-2">
        <Search className="size-5 text-gray-400" />
        <Input 
          placeholder="Buscar por nome ou slug..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="border-0 shadow-none focus-visible:ring-0"
        />
      </CardContent></Card>

      {/* Tabela Principal */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loja</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead className="text-center">Métricas</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStores.map((store) => (
              <TableRow key={store.id}>
                <TableCell>
                  <div className="font-medium text-gray-900">{store.name}</div>
                  <div className="text-xs text-gray-500 font-mono">{store.slug}</div>
                </TableCell>
                <TableCell>
                  <Badge className={store.subscriptionActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {store.subscriptionActive ? "Ativa" : "Suspensa"}
                  </Badge>
                </TableCell>
                <TableCell><Badge variant="outline">{store.plan}</Badge></TableCell>
                <TableCell className="text-center text-sm text-gray-600">
                  {store._count?.vehicles} Carros | {store._count?.leads} Leads
                </TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => window.open(`/loja/${store.slug}`, '_blank')}>
                    <ExternalLink className="size-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { setSelectedStore(store); setIsEditDialogOpen(true); }}>
                    <Edit className="size-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDelete(store)}>
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Modal de Edição */}
      {selectedStore && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Loja: {selectedStore.name}</DialogTitle>
            </DialogHeader>
            <form action={handleEditStoreAction} className="space-y-4">
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
                   <Label>Slug (URL)</Label>
                   <Input name="slug" defaultValue={selectedStore.slug} required />
                 </div>
                 <div className="space-y-2">
                   <Label>Plano</Label>
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
                   <Label>Status</Label>
                   <Select name="status" defaultValue={selectedStore.subscriptionActive ? "active" : "suspended"}>
                     <SelectTrigger><SelectValue /></SelectTrigger>
                     <SelectContent>
                       <SelectItem value="active">Ativa</SelectItem>
                       <SelectItem value="suspended">Suspensa</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="col-span-2 space-y-2">
                   <Label>Endereço</Label>
                   <Input name="endereco" defaultValue={selectedStore.address} />
                 </div>
                 <div className="space-y-2">
                   <Label>Telefone</Label>
                   <Input name="telefone" defaultValue={selectedStore.phone} />
                 </div>
                 <div className="space-y-2">
                   <Label>Cor da Marca</Label>
                   <Input name="color" type="color" defaultValue={selectedStore.primaryColor} />
                 </div>
               </div>
               <div className="flex gap-3 pt-4">
                 <Button type="submit" className="flex-1 bg-purple-600" disabled={isSubmitting}>
                   {isSubmitting ? "Salvando..." : "Salvar Alterações"}
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