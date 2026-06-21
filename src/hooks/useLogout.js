"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/auth";
import { toast } from "sonner";

export function useLogout() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const logout = async () => {
        setLoading(true);
        try {
            await logoutUser();
            toast.success("Logout success! Redirecting...");
            setTimeout(() => {
                router.push("/login");
                router.refresh();
            }, 800);
        } catch (error) {
            toast.error(error.message || "Failed to logout, Try Again.");
        } finally {
            setLoading(false);
        }
    };

    return { logout, loading };
}