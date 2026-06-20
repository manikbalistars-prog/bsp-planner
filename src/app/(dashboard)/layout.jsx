"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { toast, Toaster } from "sonner";


export default function DashboardLayout({ children }) {
    const searchParams = useSearchParams()
    const [user, setUser] = useState(null);
    const errorType = searchParams.get("error")


    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch("/api/auth/me");
                const data = await res.json();

                setUser(data.user);
            } catch (err) {
                console.error(err);
            }
        };

        getUser();
    }, []);

    useEffect(() => {
        if (errorType === "unauthorized") {
            toast.error("You don't have access to that page!");
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [errorType]);
    return (
        <div className="flex w-full h-screen p-2 gap-2 overflow-hidden">
            <Toaster position="top-center" richColors />
            <Sidebar></Sidebar>
            <div className="w-full flex flex-col flex-1 gap-2">
                <Navbar username={user?.name}></Navbar>
                <div className="flex-1 bg-stone-100 rounded-xl py-3 px-3 overflow-y-scroll">{children}</div>
            </div>
        </div>
    )
}