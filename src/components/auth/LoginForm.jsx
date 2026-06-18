import InputForm from "../ui/InputForm"
import Button from "../ui/Button"
import Link from "next/link"
export default function LoginForm() {
    return (
        <div className="flex flex-col gap-2 w-full">
            <InputForm
                label="Username"
                name="username"
                type="text"
                placeholder="input username here!" required={true} />

            <InputForm
                label="Password"
                name="password"
                type="password"
                placeholder="input password here!" required={true} />

            {/* <div className="self-end"><Link href="#" className="text-sm text-blue-500">Forgot Password?</Link></div> */}

<div className="pt-2"></div>
            <Button label={"Login"} id={"login"} variant="primary"/>

           <div className="pt-2 w-full flex justify-center"> <Link className="text-sm text-center text-stone-600" href="https://wa.me/6287848905327?text=hi,%20i%20need%20BSP%20planner%20account" target="_blank">Don't Have An Account?</Link></div>
        </div>
    )
}