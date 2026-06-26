"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MyButton } from "@/components/ui/MyButton"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { IconClipboardPlus, IconEdit, IconTrash } from "@tabler/icons-react"
import Link from "next/link"
import { DeleteConfirmDialog } from "@/components/ui/DeleteConfirmDialog"
import ItemInputDialog from "@/components/ui/ItemInputDialog"



export default function PlanDetail() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(true);
    const [itemDialogOpen, setItemDialogOpen] = useState(false)
    const [itemLoading, setItemLoading] = useState(false)

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

    const handleDelete = async (id_plan, id_user_plan) => {
        try {
            const res = await fetch(`/api/plan/${id_plan}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_plan: id_plan,
                    id_user_plan: id_user_plan,
                }),
            });
            const data = await res.json();

            const msg =
                data.message === "Unauthorized"
                    ? "You dont have access to delete this"
                    : "Fail to delete data!";
            if (!res.ok) {
                toast.error(msg, { description: `error : ${data.message}` });
                return;
            }
            toast.success(`Data success deleted!`);
            router.push("/plan");
        } catch (err) {
            toast.error("Something went wrong", { description: `${err}` });
        }
    }

    const handleCreateItem = async ({ time, description }) => {
        if (!plan?.id || !plan?.user?.id) {
            toast.error("Plan data is not ready")
            return
        }

        setItemLoading(true)
        try {
            const res = await fetch("/api/plan/item", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_plan: plan.id,
                    time,
                    description,
                    status: "pending",
                }),
            })

            const data = await res.json()

            if (!res.ok || !data.success) {
                const msg =
                    data.message === "Unauthorized"
                        ? "You dont have access to add this"
                        : "Failed to save item"
                throw new Error(msg)
            }

            toast.success("Item added successfully")
            setItemDialogOpen(false)
            router.refresh()
        } catch (err) {
            toast.error("Failed to add item", { description: err.message })
        } finally {
            setItemLoading(false)
        }
    }


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
                                <DeleteConfirmDialog
                                    title="Delete Plan"
                                    description="Are you sure you want to delete this plan?"
                                    onConfirm={() => handleDelete(plan.id, plan.user.id)}
                                    trigger={<MyButton iconOnly icon={IconTrash} variant="danger" />}
                                />
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
                            <ItemInputDialog
                                trigger={<MyButton label="Add Activity" variant="success" icon={IconClipboardPlus} iconPosition="right" />}
                                open={itemDialogOpen}
                                onOpenChange={setItemDialogOpen}
                                onSubmit={handleCreateItem}
                                loading={itemLoading}
                            />
                        </div>
                        <div className="">content</div>
                    </div>
                </div>
            )}
        </div>
    )

}