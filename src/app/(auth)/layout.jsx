import { Toaster } from "sonner";

export default function AuthLayout({ children }) {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <Toaster position="top-center" richColors /> 
            {children}
        </div>
    )
}