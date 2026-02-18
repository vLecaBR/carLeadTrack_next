"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { createVehicle } from "@/app/actions/vehicle";

// Tipagem baseada no nosso Prisma Schema
type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  km: number;
  description: string | null;
  isAvailable: boolean;
  // fotos: futuramente traremos a relação de imagens
};

interface VehicleManagementProps {
  initialVehicles: Vehicle[];
}

export function VehicleManagement({ initialVehicles }: VehicleManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Filtro de busca
  const filteredVehicles = initialVehicles.filter(
    (vehicle) =>
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (isAvailable: boolean) => {
    if (isAvailable) {
      return { label: "Disponível", className: "bg-green-100 text-green-800 border-green-200" };
    }
    return { label: "Vendido/Inativo", className: "bg-gray-100 text-gray-800 border-gray-200" };
  };

  // Aqui resolvemos aquele erro de TypeScript!
  // Criamos uma função client-side que chama a Server Action
  async function handleAction(formData: FormData) {
    const result = await createVehicle(formData);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Veículo adicionado com sucesso!");
      setIsAddDialogOpen(false); // Fecha o modal
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Estoque</h2>
          <p className="mt-1 text-gray-600">Gerencie os veículos disponíveis na sua loja</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="size-4" />
              Adicionar Veículo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Veículo</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para adicionar um novo veículo ao estoque.
              </DialogDescription>
            </DialogHeader>
            
            {/* O formulário agora usa "action" e os inputs têm a propriedade "name" */}
            <form action={handleAction} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input id="brand" name="brand" placeholder="Ex: Honda" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo</Label>
                  <Input id="model" name="model" placeholder="Ex: Civic EXL" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Ano</Label>
                  <Input id="year" name="year" type="number" placeholder="1998" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="km">Quilometragem</Label>
                  <Input id="km" name="km" type="number" placeholder="150000" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input id="price" name="price" type="number" step="0.01" placeholder="35000" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descreva as características do veículo..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Salvar Veículo
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Search className="size-5 text-gray-400" />
            <Input
              placeholder="Buscar por marca ou modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 focus-visible:ring-0 shadow-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredVehicles.map((vehicle) => {
          const badge = getStatusBadge(vehicle.isAvailable);
          return (
            <Card key={vehicle.id} className="overflow-hidden transition-shadow hover:shadow-lg">
              <div className="relative aspect-video bg-gray-200">
                {/* No futuro colocaremos as imagens reais aqui */}
                <div className="flex h-full w-full items-center justify-center bg-gray-100">
                  <span className="text-sm font-medium text-gray-400">Sem imagem</span>
                </div>
                <div className="absolute right-3 top-3">
                  <Badge className={badge.className}>{badge.label}</Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {vehicle.brand} {vehicle.model}
                </h3>
                <p className="mb-3 text-sm text-gray-600">Ano {vehicle.year}</p>

                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Preço</p>
                    <p className="text-xl font-bold text-blue-600">
                      R$ {vehicle.price.toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">KM</p>
                    <p className="font-semibold text-gray-900">
                      {vehicle.km.toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>

                <p className="mb-4 line-clamp-2 text-sm text-gray-600">{vehicle.description}</p>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => setSelectedVehicle(vehicle)}>
                    <Eye className="size-4" /> Ver
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toast.info("Edição em breve")}>
                    <Edit className="size-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toast.error("Exclusão em breve")}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredVehicles.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">Nenhum veículo encontrado no estoque.</p>
          </CardContent>
        </Card>
      )}

      {/* Vehicle Detail Dialog */}
      {selectedVehicle && (
        <Dialog open={!!selectedVehicle} onOpenChange={() => setSelectedVehicle(null)}>
          <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedVehicle.brand} {selectedVehicle.model}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Marca</Label>
                  <p className="text-lg font-semibold">{selectedVehicle.brand}</p>
                </div>
                <div>
                  <Label>Modelo</Label>
                  <p className="text-lg font-semibold">{selectedVehicle.model}</p>
                </div>
                <div>
                  <Label>Ano</Label>
                  <p className="text-lg font-semibold">{selectedVehicle.year}</p>
                </div>
                <div>
                  <Label>Quilometragem</Label>
                  <p className="text-lg font-semibold">{selectedVehicle.km.toLocaleString("pt-BR")} km</p>
                </div>
                <div>
                  <Label>Preço</Label>
                  <p className="text-lg font-semibold text-blue-600">
                    R$ {selectedVehicle.price.toLocaleString("pt-BR")}
                  </p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusBadge(selectedVehicle.isAvailable).className}>
                    {getStatusBadge(selectedVehicle.isAvailable).label}
                  </Badge>
                </div>
              </div>

              <div>
                <Label>Descrição</Label>
                <p className="mt-2 text-gray-700">{selectedVehicle.description}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}