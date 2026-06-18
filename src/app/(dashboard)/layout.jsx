import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";


export default function DashboardLayout({ children }) {
    return (
        <div className="flex w-full h-screen p-2 gap-2 overflow-hidden">
            <Sidebar></Sidebar>
            <div className="w-full flex flex-col flex-1 gap-2">
                <Navbar></Navbar>
                <div className="flex-1 bg-stone-100 rounded-xl py-3 px-3 overflow-y-scroll">{children}</div>
            </div>
        </div>
    )
}