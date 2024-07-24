'use client';

import { useAuth } from "@/context/AuthContext";
import LogoutButton from "../common/Logout";

export default function Logout() {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="text-sm">
            <div>Welcome, {user.username}</div>
            <div className="text-red-800 hover:text-red-700 cursor-pointer mt-1"><LogoutButton /></div>  
        </div>
    )
}