"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded bg-red-100 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-200"
    >
      Terminar Sessão
    </button>
  );
}