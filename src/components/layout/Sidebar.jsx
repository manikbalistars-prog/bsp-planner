'use client';
import { IconDeviceAnalytics, IconArrowBarRight, IconArrowBarLeft, IconLayoutDashboard, IconCalendarEvent, IconUsers } from "@tabler/icons-react"
import { useState } from "react"
import LinkSidebar from "../ui/LinkSidebar";


export default function Sidebar({ isAdmin }) {
    const [open, setOpen] = useState(false)


    return (

        <div className="h-full min-w-2 bg-stone-100 rounded-xl pt-5 pb-3 px-3 flex flex-col justify-between items-center" >
            <div className="flex flex-col items-center">
                <IconDeviceAnalytics className="text-stone-500"></IconDeviceAnalytics>
                <div className="border-b border-b-stone-300 pt-1 w-full"></div>

                <div className="pt-5">
                    {open && (
                        <p className="text-sm text-stone-400 py-4">menu</p>
                    )}
                    <div className="gap-7 flex flex-col">
                        <LinkSidebar href="/dashboard" label="Dashboard" icon={IconLayoutDashboard} open={open} />
                        <LinkSidebar href="/plan" label="Planner" icon={IconCalendarEvent} open={open} />
                        <LinkSidebar href="/user" label="Users" icon={IconUsers} open={open} />
                    </div>

                </div>
            </div>
            <div className="text-stone-500 w-full border-t-stone-300 border-t pt-2 flex items-center justify-center">
                <button onClick={() => setOpen(!open)} className="hover:cursor-pointer hover:text-stone-900">

                    {!open ? <IconArrowBarRight /> : <IconArrowBarLeft />}
                </button>

            </div>
        </div>
    )
}

