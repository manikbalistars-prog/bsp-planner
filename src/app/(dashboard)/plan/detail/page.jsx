"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { MyButton } from "@/components/ui/MyButton"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"


export default function PlanDetail() {
    const params = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false);

    const [plan, setPlan] = useState(null)

    useEffect(() => {
        const dataRaw = searchParams.get("data")
        if (dataRaw) {
            try {
                setLoading(true)
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
                <div>
                    <div className="bg-white rounded-sm p-2 ">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="">Detail Plan</h1></div>
                            <MyButton
                                label="back"
                                variant="primary"
                                onClick={() => router.back()}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

}