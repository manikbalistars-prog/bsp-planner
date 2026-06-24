'use client';
import { IconLayoutDashboard, IconCalendarEvent, IconUsers } from "@tabler/icons-react"
import LinkBottomBar from "../ui/LinkBottomBar";


export default function BottomBar() {
    return (
        <div className="w-full rounded-xl py-2 px-3 flex items-center justify-evenly gap-5" >
            <div className="relative"><LinkBottomBar href="/plan" label="Planner" icon={IconCalendarEvent} /></div>
            <div className="relative"> <LinkBottomBar href="/dashboard" label="Dashboard" icon={IconLayoutDashboard} /></div>
            <div className="relative"><LinkBottomBar href="/user" label="Users" icon={IconUsers} /></div>
        </div>
    )
}

