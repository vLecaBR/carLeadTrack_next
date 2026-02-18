"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // O Next-Auth gerencia a chamada para o backend de forma invisível
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Mantemos false para podermos tratar o erro na tela
    });

    if (result?.error) {
      setError("Credenciais inválidas. Tente novamente.");
      setLoading(false);
    } else {
      // Se deu certo, manda o cara pro painel
      router.push("/dashboard"); 
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
          MVPCarLead
        </h2>
        
        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="admin@plataforma.com"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-2.5 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? "Entrando..." : "Entrar no Sistema"}
          </button>
        </form>
      </div>
    </div>
  );
}