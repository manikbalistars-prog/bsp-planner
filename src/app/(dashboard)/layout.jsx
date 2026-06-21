"use client"
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { toast } from "sonner";

import { Spinner } from "@/components/ui/spinner"
import { AuthContext } from "@/context/AuthContext";


export default function DashboardLayout({ children }) {
    const searchParams = useSearchParams()
    const [user, setUser] = useState(null);
    const errorType = searchParams.get("error")
    const [layoutLoading, setLayoutLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch("/api/auth/me");
                const data = await res.json();

                setUser(data.user);
            } catch (err) {
                console.error(err);
            } finally {
                setLayoutLoading(false);
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

    if (layoutLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-stone-50">
                <Spinner />
            </div>
        );
    }
    return (
        <AuthContext.Provider value={{ currentUser: user }}>
            <div className="w-full h-screen p-2 gap-2 overflow-hidden flex">
                <Sidebar isAdmin={user?.isAdmin}></Sidebar>
                <div className="w-full flex flex-col flex-1 gap-2">
                    <Navbar user={user} ></Navbar>
                    <div className="flex-1 bg-stone-100 rounded-xl py-3 px-3 overflow-y-scroll">
                        {children}
                    </div>
                </div>
            </div>
        </AuthContext.Provider>
    )
}