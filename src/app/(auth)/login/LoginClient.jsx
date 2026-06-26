"use client"

import LoginForm from "@/components/auth/LoginForm"
import { IconUser } from "@tabler/icons-react"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

export default function LoginClient() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const error = searchParams.get("error")

        if (!error) return

        const messages = {
            session_missing: "Session not found. Please log in again.",
            session_invalid: "The session is invalid or has been modified. Please log in again.",
        }

        toast.error(messages[error] || "Session error. Please log in again.")
        router.replace("/login")
    }, [router, searchParams])

    return (
        <div className="bg-stone-100 p-5 rounded-xl flex flex-col items-center min-w-80 relative z-10">
            <IconUser className="text-blue-500" size={70} />
            <p className="pb-5 text-stone-700">Hello!!!</p>
            <LoginForm />
        </div>
    )
}