"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Mail, Phone, UserX, Crown, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { createSeller } from "@/app/actions/team";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
};

interface TeamManagementProps {
  initialMembers: TeamMember[];
  currentUserId: string;
}

export function TeamManagement({ initialMembers, currentUserId }: TeamManagementProps) {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInvite = async (formData: FormData) => {
    setIsSubmitting(true);
    const result = await createSeller(formData);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Vendedor cadastrado com sucesso! Acesso liberado.");
      setIsInviteDialogOpen(false);
    }
    setIsSubmitting(false);
  };

  const getRoleBadge = (role: string) => {
    return role === "OWNER" ? (
      <Badge className="gap-1 border-purple-200 bg-purple-100 text-purple-800">
        <Crown className="size-3" />
        Proprietário
      </Badge>
    ) : (
      <Badge className="gap-1 border-blue-200 bg-blue-100 text-blue-800">
        <UserIcon className="size-3" />
        Vendedor
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestão de Equipe</h2>
          <p className="mt-1 text-gray-600">Gerencie os membros da sua equipe de vendas.</p>
        </div>
        
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="size-4" />
              Adicionar Vendedor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Vendedor</DialogTitle>
              <DialogDescription>
                Crie um acesso para um vendedor gerenciar seus leads. A senha inicial será: <strong>mudar123</strong>
              </DialogDescription>
            </DialogHeader>
            <form action={handleInvite} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" name="name" placeholder="Ex: João Silva" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail (Login)</Label>
                <Input id="email" name="email" type="email" placeholder="joao@loja.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone (Opcional)</Label>
                <Input id="phone" name="phone" type="tel" placeholder="(11) 98765-4321" />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                  {isSubmitting ? "Criando..." : "Criar Acesso"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total de Membros</p>
            <p className="text-2xl font-bold text-gray-900">{initialMembers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Vendedores Ativos</p>
            <p className="text-2xl font-bold text-blue-600">
              {initialMembers.filter(m => m.role === "SELLER").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Membros da Loja</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {initialMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100">
                <div className="flex items-center gap-4">
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-blue-600 text-lg text-white">
                      {member.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      {getRoleBadge(member.role)}
                      {member.id === currentUserId && (
                        <Badge variant="outline" className="text-gray-500">Você</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="size-4" />
                        {member.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {member.role !== "OWNER" && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => toast.info("Edição em desenvolvimento")}>
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => toast.error("Exclusão em desenvolvimento")}>
                        <UserX className="size-4 text-red-500" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permissions Info */}
      <Card>
        <CardHeader>
          <CardTitle>Permissões por Função</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Crown className="size-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Proprietário</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2"><div className="size-1.5 rounded-full bg-green-500"></div>Acesso total ao sistema e faturamento</li>
                <li className="flex items-center gap-2"><div className="size-1.5 rounded-full bg-green-500"></div>Gerenciar estoque e configurações</li>
                <li className="flex items-center gap-2"><div className="size-1.5 rounded-full bg-green-500"></div>Cadastrar e remover vendedores</li>
              </ul>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2">
                <UserIcon className="size-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Vendedor</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2"><div className="size-1.5 rounded-full bg-green-500"></div>Ver estoque disponível</li>
                <li className="flex items-center gap-2"><div className="size-1.5 rounded-full bg-green-500"></div>Acessar e atualizar status de Leads</li>
                <li className="flex items-center gap-2"><div className="size-1.5 rounded-full bg-red-500"></div>Sem acesso a painéis de donos ou financeiro</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}