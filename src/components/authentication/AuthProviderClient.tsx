"use client";

import { AuthProvider } from "@clerk/nextjs";

export default function AuthProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
