'use client';

/**
 * ProtectedRoute is now handled by Clerk middleware.
 * This wrapper is kept for backward compatibility.
 */
export function ProtectedRoute({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

export default ProtectedRoute;
