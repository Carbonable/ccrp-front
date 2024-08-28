"use client";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { useUser } from "@clerk/nextjs";
import PortfolioNavigationTabs from "@/components/portfolio/Navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUser();
  let userName = "loading_dashboard";
  if (user) {
    userName = user.fullName ?? user.firstName!;
  }

  return (
    <div className="mt-8">
      <ProtectedRoute key={userName}>
        <PortfolioNavigationTabs />
        <div>{children}</div>
      </ProtectedRoute>
    </div>
  );
}
