import { Suspense } from "react"
import LoginClient from "./LoginClient"

export default function Login() {
    return (
        <Suspense
            fallback={
                <div className="bg-stone-100 p-5 rounded-xl flex flex-col items-center min-w-80 relative z-10">
                    <p className="text-stone-700">Loading...</p>
                </div>
            }
        >
            <LoginClient />
        </Suspense>
    )
}