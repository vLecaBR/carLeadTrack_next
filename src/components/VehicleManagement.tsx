"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash2, Car, QrCode, Calendar, Gauge, DollarSign, Image as ImageIcon, AlignLeft } from 'lucide-react';
import { toast } from 'sonner';
import { createVehicle, updateVehicle, deleteVehicle } from '@/app/actions/vehicle';

export function VehicleManagement({ initialVehicles, storeId }: { initialVehicles: any[], storeId: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modais
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isQrCodeOpen, setIsQrCodeOpen] = useState(false);
  
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtro
  const filteredVehicles = initialVehicles.filter(v =>
    `${v.brand} ${v.model}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.year.toString().includes(searchTerm)
  );

  // Máscara de Moeda (Exibe bonito enquanto digita)
  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return (Number(numbers) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Handlers Action
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const result = await createVehicle(formData);
    
    if (result.success) {
      toast.success('Veículo adicionado ao estoque!');
      setIsAddOpen(false);
    } else {
      toast.error(result.error);
    }
    setIsSubmitting(false);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;
    setIsSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const result = await updateVehicle(selectedVehicle.id, formData);
    
    if (result.success) {
      toast.success('Veículo atualizado!');
      setIsEditOpen(false);
      setSelectedVehicle(null);
    } else {
      toast.error(result.error);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (vehicle: any) => {
    if (confirm(`Atenção: Tem certeza que deseja remover o ${vehicle.brand} ${vehicle.model} do estoque?`)) {
      const result = await deleteVehicle(vehicle.id);
      if (result.success) toast.success('Veículo removido.');
      else toast.error(result.error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Meu Estoque</h1>
          <p className="text-gray-500 mt-1">Gerencie sua vitrine e gere QR Codes para as lojas físicas.</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 gap-2 h-12 px-6 rounded-xl">
              <Plus className="size-5" /> Adicionar Veículo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Novo Veículo</DialogTitle>
              <DialogDescription>Cadastre as informações completas para exibir na vitrine.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 mt-4">
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label className="font-semibold">Marca *</Label>
                   <Input name="brand" placeholder="Ex: Honda" className="bg-gray-50" required />
                 </div>
                 <div className="space-y-2">
                   <Label className="font-semibold">Modelo *</Label>
                   <Input name="model" placeholder="Ex: Civic EXL 2.0" className="bg-gray-50" required />
                 </div>
                 <div className="space-y-2">
                   <Label className="font-semibold flex items-center gap-2"><Calendar className="size-4 text-gray-400"/> Ano *</Label>
                   <Input name="year" type="number" placeholder="Ex: 2018" className="bg-gray-50" required />
                 </div>
                 <div className="space-y-2">
                   <Label className="font-semibold flex items-center gap-2"><DollarSign className="size-4 text-gray-400"/> Preço de Venda *</Label>
                   <Input name="price" placeholder="R$ 0,00" onChange={(e) => e.target.value = formatCurrency(e.target.value)} className="bg-gray-50 font-bold text-green-700" required />
                 </div>
                 <div className="space-y-2">
                   <Label className="font-semibold flex items-center gap-2"><Gauge className="size-4 text-gray-400"/> Quilometragem</Label>
                   <Input name="km" type="number" placeholder="Ex: 50000" className="bg-gray-50" />
                 </div>
                 <div className="space-y-2">
                   <Label className="font-semibold flex items-center gap-2"><ImageIcon className="size-4 text-gray-400"/> URL da Foto</Label>
                   <Input name="imageUrl" placeholder="https://..." className="bg-gray-50" />
                 </div>
                 <div className="col-span-2 space-y-2">
                   <Label className="font-semibold flex items-center gap-2"><AlignLeft className="size-4 text-gray-400"/> Opcionais / Descrição</Label>
                   <Input name="description" placeholder="Ar condicionado, Direção, Único dono..." className="bg-gray-50" />
                 </div>
               </div>
               <div className="pt-4 mt-4 border-t">
                 <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg rounded-xl" disabled={isSubmitting}>
                   {isSubmitting ? "Salvando..." : "Cadastrar Veículo"}
                 </Button>
               </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Busca */}
      <div className="relative group max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
        <Input 
          placeholder="Buscar por marca, modelo ou ano..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="pl-12 h-14 bg-white border-2 border-gray-100 rounded-2xl shadow-sm text-base"
        />
      </div>

      {/* Grid de Veículos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => {
          // Pega a primeira imagem do array (se existir)
          const imageUrl = vehicle.images && vehicle.images.length > 0 ? vehicle.images[0].url : null;
          
          return (
            <Card key={vehicle.id} className="overflow-hidden border-2 border-gray-100 hover:border-blue-200 transition-all bg-white rounded-2xl group flex flex-col">
              
              {/* Foto do Veículo */}
              <div className="relative h-56 bg-gray-100 w-full overflow-hidden shrink-0 flex items-center justify-center">
                {imageUrl ? (
                  <img src={imageUrl} alt={vehicle.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center">
                    <Car className="size-12 opacity-50 mb-2" />
                    <span className="text-sm font-medium">Sem foto principal</span>
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-sm font-black text-gray-900 shadow-sm">
                  {vehicle.year}
                </div>
              </div>

              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{vehicle.brand}</p>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight truncate">{vehicle.model}</h3>
                  <p className="text-2xl font-black text-green-600 mt-2">
                    {Number(vehicle.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-6">
                  <div className="bg-gray-50 p-2 rounded-lg text-center border border-gray-100">
                    <p className="text-xs text-gray-500 font-bold uppercase">Odômetro</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{vehicle.km ? `${vehicle.km.toLocaleString('pt-BR')} km` : '0 km'}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg text-center border border-gray-100">
                    <p className="text-xs text-gray-500 font-bold uppercase">Status</p>
                    <p className="text-sm font-semibold text-blue-600 mt-0.5">{vehicle.isAvailable ? 'Disponível' : 'Vendido'}</p>
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-2 pt-4 border-t border-gray-50">
                  <Button 
                    variant="outline" 
                    className="w-full gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => { setSelectedVehicle(vehicle); setIsQrCodeOpen(true); }}
                  >
                    <QrCode className="size-4" /> Imprimir QR
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="secondary" className="flex-1" onClick={() => { setSelectedVehicle(vehicle); setIsEditOpen(true); }}>
                      <Edit className="size-4" />
                    </Button>
                    <Button variant="ghost" className="px-3 text-red-500 hover:bg-red-50" onClick={() => handleDelete(vehicle)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredVehicles.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white border-2 border-dashed rounded-3xl">
            <Car className="size-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">Seu estoque está vazio</h3>
            <p className="text-gray-500 mt-2">Clique em "Adicionar Veículo" para começar a montar sua vitrine.</p>
          </div>
        )}
      </div>

      {/* ======================================= */}
      {/* MODAL DE EDIÇÃO */}
      {/* ======================================= */}
      {selectedVehicle && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Editar {selectedVehicle.model}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEdit} className="space-y-4 mt-4">
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label className="font-semibold">Marca *</Label>
                   <Input name="brand" defaultValue={selectedVehicle.brand} required />
                 </div>
                 <div className="space-y-2">
                   <Label className="font-semibold">Modelo *</Label>
                   <Input name="model" defaultValue={selectedVehicle.model} required />
                 </div>
                 <div className="space-y-2">
                   <Label className="font-semibold">Ano *</Label>
                   <Input name="year" type="number" defaultValue={selectedVehicle.year} required />
                 </div>
                 <div className="space-y-2">
                   <Label className="font-semibold">Preço de Venda *</Label>
                   <Input name="price" defaultValue={(selectedVehicle.price * 100).toString()} onChange={(e) => e.target.value = formatCurrency(e.target.value)} required />
                 </div>
                 <div className="space-y-2">
                   <Label className="font-semibold">Quilometragem</Label>
                   <Input name="km" type="number" defaultValue={selectedVehicle.km} />
                 </div>
                 <div className="space-y-2">
                   <Label className="font-semibold">URL da Foto</Label>
                   <Input name="imageUrl" defaultValue={selectedVehicle.images?.[0]?.url || ""} />
                 </div>
                 <div className="col-span-2 space-y-2">
                   <Label className="font-semibold">Opcionais / Descrição</Label>
                   <Input name="description" defaultValue={selectedVehicle.description || ""} />
                 </div>
               </div>
               <div className="pt-4 mt-4 border-t flex gap-3">
                 <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 h-12" disabled={isSubmitting}>
                   {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                 </Button>
                 <Button type="button" variant="outline" className="h-12" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
               </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* ======================================= */}
      {/* MODAL DE QR CODE (A MÁGICA DA PLATAFORMA) */}
      {/* ======================================= */}
      {selectedVehicle && (
        <Dialog open={isQrCodeOpen} onOpenChange={setIsQrCodeOpen}>
          <DialogContent className="sm:max-w-sm text-center rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold">QR Code do Anúncio</DialogTitle>
              <DialogDescription className="text-center">Coloque este QR Code no vidro do carro ou no post do Instagram.</DialogDescription>
            </DialogHeader>
            
            <div className="py-6 flex flex-col items-center justify-center">
              {/* Gera um QR Code real na hora usando a API do GoQR */}
              <div className="p-4 bg-white border-4 border-blue-500 rounded-2xl shadow-xl">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://leadtrack.com.br/lead/${storeId}/${selectedVehicle.id}&margin=10`} 
                  alt="QR Code" 
                  className="size-48"
                />
              </div>
              
              <p className="mt-6 text-sm font-bold text-gray-900">{selectedVehicle.brand} {selectedVehicle.model}</p>
              
              <div className="mt-4 w-full bg-gray-50 p-3 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500 font-bold uppercase mb-2 text-left">Link Rastreável</p>
                <div className="flex items-center gap-2">
                  <Input readOnly value={`https://leadtrack.com.br/l/${selectedVehicle.id.slice(-6)}`} className="h-10 text-sm bg-white font-mono" />
                  <Button size="sm" variant="secondary" className="h-10 px-4" onClick={() => toast.success('Link copiado!')}>Copiar</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}