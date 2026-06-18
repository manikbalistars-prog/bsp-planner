import LoginForm from "@/components/auth/LoginForm"
import { IconUser } from "@tabler/icons-react"

export default function Login() {
    return (

        <div className="bg-stone-100 p-5 rounded-xl flex flex-col items-center min-w-80 relative z-10">
            <IconUser className='text-blue-500' size={70}></IconUser>
            <p className="pb-5 text-stone-700">Hello!!!</p>
            <LoginForm></LoginForm>
        </div>

    )
}