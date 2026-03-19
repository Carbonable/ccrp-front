'use client';

export function ProtectedRoute({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

export default ProtectedRoute;
