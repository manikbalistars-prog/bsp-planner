'use client';
import { IconLayoutDashboard, IconCalendarEvent, IconUsers, IconListDetails } from "@tabler/icons-react"
import LinkBottomBar from "../ui/LinkBottomBar";
import { useAuth } from "@/context/AuthContext"


export default function BottomBar() {
    const { currentUser } = useAuth()


    return (
        <div className="w-full rounded-xl py-2 px-3 flex items-center justify-evenly gap-5" >
            {currentUser.role?.role != "kepala cabang" && (<div className="relative"><LinkBottomBar href="/items" label="All Items" icon={IconListDetails} /></div>)}

            <div className="relative"><LinkBottomBar href="/plan" label="Planner" icon={IconCalendarEvent} /></div>
            <div className="relative"> <LinkBottomBar href="/dashboard" label="Dashboard" icon={IconLayoutDashboard} /></div>
            <div className="relative"><LinkBottomBar href="/user" label="Users" icon={IconUsers} /></div>
        </div>
    )
}

