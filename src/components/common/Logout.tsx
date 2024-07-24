'use client';

import { useAuth } from "@/context/AuthContext";
import { PowerIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };
  return (
    <div onClick={handleLogout} className="flex items-center justify-start font-bold">
      <PowerIcon className="w-4 h-4 mr-2" />
      <button className="uppercase">Logout</button>
    </div>
    
  )
}