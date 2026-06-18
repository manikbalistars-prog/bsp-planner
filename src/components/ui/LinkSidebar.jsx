import Link from "next/link";
import { usePathname } from "next/navigation";



export default function LinkSidebar({ label, href, icon: Icon, open }) {
    const pathname = usePathname()
    return (
        <Link href={href}
            className={`flex items-center gap-2 text-base   ${pathname === href ? "font-bold text-stone-700 li-active " : "text-stone-400"}`}>
            <Icon size={20} className={` ${pathname === href ? "text-bold text-blue-500" : "text-stone-400"}`}></Icon>
            {open && (
                <span>{label}</span>
            )}
        </Link>
    )
}