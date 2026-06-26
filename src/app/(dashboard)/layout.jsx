"use client"
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import BottomBar from "@/components/layout/BottomBar";
import { toast } from "sonner";

import { Spinner } from "@/components/ui/spinner"
import { AuthContext } from "@/context/AuthContext";
import { usePathname } from "next/navigation";


function DashboardLayoutContent({ children }) {
    const searchParams = useSearchParams()
    const [user, setUser] = useState(null);
    const errorType = searchParams.get("error")
    const [layoutLoading, setLayoutLoading] = useState(true);

    const pathname = usePathname()
    const showOnPaths = ["/plan", "/dashboard", "/user"];
    const shouldShow = showOnPaths.includes(pathname);



    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch("/api/auth/me");
                const data = await res.json();

                setUser(data.user);
            } catch (err) {
                toast.error(err);
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
            <div className="flex flex-col gap-2 bg-stone-200">


                <div className="fixed w-full shadow-sm rounded-b-xl bg-white top-0 z-50">
                    <Navbar user={user}></Navbar>
                </div>
                <div className="min-h-11"></div>

                <div className="w-full flex-1 rounded-xl py-3 min-h-screen px-2">
                    {children}
                </div>
                {shouldShow && (
                    <>
                        <div className="bg-white w-full px-8 rounded-t-lg fixed bottom-0 drop-shadow-lg z-50">
                            <BottomBar></BottomBar>
                        </div>
                        <div className="min-h-14"></div>
                    </>
                )}

            </div>
        </AuthContext.Provider>
    )
}

export default function DashboardLayout({ children }) {
    return (
        <Suspense fallback={
            <div className="w-full h-screen flex items-center justify-center bg-stone-50">
                <Spinner />
            </div>
        }>
            <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </Suspense>
    );
}