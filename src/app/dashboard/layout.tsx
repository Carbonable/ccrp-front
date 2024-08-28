"use client";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { useUser } from "@clerk/nextjs";
import DashboardNavigationTabs from "@/components/dashboard/Navigation";

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
        <DashboardNavigationTabs />
        <div>{children}</div>
      </ProtectedRoute>
    </div>
  );
}
