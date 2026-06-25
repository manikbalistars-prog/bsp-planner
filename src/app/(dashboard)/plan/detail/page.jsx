"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MyButton } from "@/components/ui/MyButton"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { IconClipboardPlus, IconEdit } from "@tabler/icons-react"
import Link from "next/link"


export default function PlanDetail() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(true);

    const [plan, setPlan] = useState(null)



    useEffect(() => {
        const id = searchParams.get("id")

        if (!id) {
            setLoading(false)
            toast.error("Plan ID is missing")
            return
        }

        const loadPlan = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/plan/${id}`)
                const data = await res.json()

                if (!res.ok || !data.success) {
                    throw new Error(data.message || "Failed to load plan")
                }

                setPlan(data.plan)
            } catch (err) {
                toast.error("Failed to load plan", { description: err.message });
            } finally {
                setLoading(false)
            }
        }

        loadPlan()
    }, [searchParams])


    return (
        <div className="w-full">
            {loading ? (
                <div className="flex justify-center items-center h-32 gap-2">
                    <Spinner />
                </div>
            ) : !plan ? (
                <div className="flex flex-col items-center justify-center h-32 gap-3 bg-white rounded-sm p-3">
                    <div className="text-sm text-stone-500">Plan data is not available.</div>
                    <Link href="/plan">
                        <MyButton
                            label="back"
                            variant="primary"

                        /></Link>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    <div className="bg-white rounded-sm p-3 ">
                        <div className="flex justify-between items-center border-b pb-2">
                            <div>
                                <h1 className="text-stone-400 font-bold">Detail Plan</h1></div>
                            <div className="flex gap-2">
                                <Link href={`/plan/edit?id=${plan.id}`}>
                                    <MyButton
                                        icon={IconEdit}
                                        variant="warning"
                                        iconOnly
                                    /></Link>
                                <Link href="/plan">
                                    <MyButton
                                        label="back"
                                        variant="primary"

                                    /></Link>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 pt-2 gap-5">
                            <div className="">
                                <div className="text-base font-bold text-stone-900">{plan.title}</div>
                                <div className="text-xs text-stone-500">{formatDate(plan.date, true)}</div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="">
                                    <div className="text-xs text-stone-400">Assgined to</div>
                                    <div className="">{plan.user?.name}</div>
                                </div>
                                <div className="">
                                    <div className="text-xs text-stone-400">Branch</div>
                                    <div>{plan.branch?.name}</div>
                                </div>

                            </div>
                        </div>

                        <div className="flex justify-between text-xs text-stone-400 pt-10 flex-wrap gap-2">
                            <div>Total Task <span className="block text-lg text-stone-900">0</span></div>
                            <div>Total Completed <span className="block text-lg text-green-900">0/0</span></div>
                            <div>Total Points <span className="block text-lg text-blue-900">0</span></div>
                        </div>

                    </div>

                    <div className="bg-white rounded-sm p-3 flex flex-col gap-5">
                        <div className="flex">
                            <MyButton label="add task" variant="success" icon={IconClipboardPlus} iconPosition="right" />
                        </div>
                        <div className="">content</div>
                    </div>
                </div>
            )}
        </div>
    )

}