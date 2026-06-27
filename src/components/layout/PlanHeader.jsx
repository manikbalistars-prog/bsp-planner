import React from "react"
import Link from "next/link"
import { MyButton } from "@/components/ui/MyButton"
import { formatDate } from "@/lib/utils"
import { IconEdit, IconTrash } from "@tabler/icons-react"
import { DeleteConfirmDialog } from "../ui/DeleteConfirmDialog"

export default function PlanHeaderCard({ plan, onDelete, showAction }) {
    return (
        <div className="bg-white rounded-sm p-3">
            <div className="flex justify-between items-center border-b pb-2">
                <div>
                    <h1 className="text-stone-400 font-bold">Detail Plan</h1>
                </div>
                <div className="flex gap-2">
                    {showAction && (
                        <>
                            <DeleteConfirmDialog
                                title="Delete User"
                                description="Are you sure you want to delete this?"
                                onConfirm={() => onDelete(plan.id, plan.user.id)}
                                trigger={<MyButton
                                    iconOnly
                                    icon={IconTrash}
                                    variant="danger"

                                />}
                            />
                            <Link href={`/plan/edit?id=${plan.id}`}>
                                <MyButton icon={IconEdit} variant="warning" iconOnly />
                            </Link></>
                    )}

                    <Link href="/plan">
                        <MyButton label="back" variant="primary" />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 pt-2 gap-5">
                <div>
                    <div className="text-base font-bold text-stone-900">{plan.title}</div>
                    <div className="text-xs text-stone-500">{formatDate(plan.date, true)}</div>
                </div>

                <div className="flex flex-col gap-2">
                    <div>
                        <div className="text-xs text-stone-400">Assigned to</div>
                        <div>{plan.user?.name}</div>
                    </div>
                    <div>
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
    )
}