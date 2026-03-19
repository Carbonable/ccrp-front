'use client';

import { useAuth } from '../auth/AuthProvider';

export default function Logout() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="text-sm">
      <div className="text-left">
        <div className="overflow-hidden text-ellipsis">{user.email}</div>
        <button className="mt-2 text-red-500" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
