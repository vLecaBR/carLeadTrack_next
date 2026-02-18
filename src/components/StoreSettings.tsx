"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Palette, Link as LinkIcon, Save, Copy } from "lucide-react";
import { toast } from "sonner";
import { updateStoreSettings } from "@/app/actions/store";

export function StoreSettings({ store }: { store: any }) {
  const [primaryColor, setPrimaryColor] = useState(store.primaryColor || "#3b82f6");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const storefrontUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/loja/${store.slug}`;

  const handleSave = async (formData: FormData) => {
    setIsSubmitting(true);
    formData.append("primaryColor", primaryColor); // Adiciona a cor do state
    
    const result = await updateStoreSettings(store.id, formData);
    if (result.error) toast.error(result.error);
    else toast.success("Configurações salvas com sucesso!");
    
    setIsSubmitting(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(storefrontUrl);
    toast.success("Link copiado para a área de transferência!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Configurações da Loja</h2>
        <p className="mt-1 text-gray-600">Personalize as informações e aparência da sua vitrine.</p>
      </div>

      <form action={handleSave} className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Store className="size-5" /> Informações</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Fantasia</Label>
                <Input id="name" name="name" defaultValue={store.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" defaultValue={store.cnpj} disabled className="bg-gray-50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Endereço Completo</Label>
              <Input id="address" name="address" defaultValue={store.address || ""} placeholder="Rua Exemplo, 123" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone / WhatsApp</Label>
              <Input id="phone" name="phone" defaultValue={store.phone || ""} placeholder="(11) 99999-9999" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="size-5" /> Aparência</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cor Principal da Vitrine</Label>
              <div className="flex items-center gap-3">
                <Input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-12 w-20 cursor-pointer" />
                <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="mb-3 font-semibold text-gray-900">Preview</h4>
              <div className="flex h-12 items-center justify-center rounded-lg font-semibold text-white shadow" style={{ backgroundColor: primaryColor }}>
                Botão da sua Vitrine
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting} className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Save className="size-4" /> {isSubmitting ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </CardContent>
        </Card>
      </form>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><LinkIcon className="size-5" /> URL da Vitrine Pública</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={storefrontUrl} disabled className="bg-gray-50 font-mono text-blue-600" />
            <Button variant="outline" onClick={copyLink}><Copy className="size-4" /></Button>
          </div>
          <p className="text-sm text-gray-500">Divulgue este link no Instagram e em anúncios para captar clientes.</p>
        </CardContent>
      </Card>
    </div>
  );
}