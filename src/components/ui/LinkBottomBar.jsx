import Link from "next/link";
import { usePathname } from "next/navigation";



export default function LinkBottomBar({ label, href, icon: Icon, open }) {
    const pathname = usePathname()
    return (
        <Link href={href}
            className={`flex flex-col items-center gap-1 text-xs ${pathname === href ? " text-blue-700 li-active " : "text-stone-400"}`}>
            <Icon size={25} className={` relative z-10 ${pathname === href ? "" : "text-stone-400"}`}></Icon>
            <div className="text-xs relative z-10">{label}</div>
        </Link>
    )
}