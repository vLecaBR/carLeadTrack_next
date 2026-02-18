"use client";

import { createStore } from "@/app/actions/store";
import { useRef } from "react";

export function CreateStoreForm() {
  const formRef = useRef<HTMLFormElement>(null);

  async function action(formData: FormData) {
    const result = await createStore(formData);
    if (result.error) {
      alert(result.error);
    } else {
      alert("Loja e Dono criados com sucesso!");
      formRef.current?.reset();
    }
  }

  return (
    <form ref={formRef} action={action} className="mt-6 space-y-4 rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">Cadastrar Nova Loja</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600">Nome da Loja</label>
          <input name="name" required className="w-full rounded border p-2" placeholder="Ex: Mega Veículos" />
        </div>
        <div>
          <label className="block text-sm text-gray-600">URL da Loja (Slug)</label>
          <input name="slug" required className="w-full rounded border p-2" placeholder="Ex: mega-veiculos" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600">CNPJ</label>
        <input name="cnpj" required className="w-full rounded border p-2" placeholder="00.000.000/0001-00" />
      </div>

      <hr className="my-4" />
      <h3 className="font-medium text-gray-700">Dados de Acesso do Dono</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600">Nome do Dono</label>
          <input name="ownerName" required className="w-full rounded border p-2" placeholder="Nome completo" />
        </div>
        <div>
          <label className="block text-sm text-gray-600">E-mail do Dono (Login)</label>
          <input name="ownerEmail" type="email" required className="w-full rounded border p-2" placeholder="dono@megaveiculos.com" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600">Senha Inicial</label>
        <input name="password" type="password" required className="w-full rounded border p-2" placeholder="Senha provisória" />
      </div>

      <button type="submit" className="mt-4 w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700">
        Criar Loja e Usuário
      </button>
    </form>
  );
}