"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MyButton } from "@/components/ui/MyButton"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { IconClipboardPlus } from "@tabler/icons-react"


export default function PlanDetail() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(true);

    const [plan, setPlan] = useState(null)



    useEffect(() => {
        const dataRaw = searchParams.get("data")

        if (dataRaw) {
            setLoading(true)
            try {
                const parsedData = JSON.parse(decodeURIComponent(dataRaw))
                setPlan(parsedData)

            } catch (err) {
                toast.error("Failed to read data", { description: err });
            } finally {
                setLoading(false)
            }
        }
    }, [searchParams])


    return (
        <div className="w-full">
            {loading ? (
                <div className="flex justify-center items-center h-32 gap-2">
                    <Spinner />
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    <div className="bg-white rounded-sm p-3 ">
                        <div className="flex justify-between items-center border-b pb-2">
                            <div>
                                <h1 className="text-stone-400 font-bold">Detail Plan</h1></div>
                            <MyButton
                                label="back"
                                variant="primary"
                                onClick={() => router.back()}
                            />
                        </div>
                        <div className="grid grid-cols-1 pt-2 gap-5">
                            <div className="">
                                <div className="text-base font-bold text-stone-900">{plan.t}</div>
                                <div className="text-xs text-stone-500">{formatDate(plan.d, true)}</div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="">
                                    <div className="text-xs text-stone-400">Assgined to</div>
                                    <div className="">{plan.u}</div>
                                </div>
                                <div className="">
                                    <div className="text-xs text-stone-400">Branch</div>
                                    <div>{plan.b}</div>
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
                            <MyButton label="add task" variant="success" icon={IconClipboardPlus} iconPosition="right"/>
                        </div>
                        <div className="">content</div>
                    </div>
                </div>
            )}
        </div>
    )

}