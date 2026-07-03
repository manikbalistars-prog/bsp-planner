import React from "react"
import Link from "next/link"
import { MyButton } from "@/components/ui/MyButton"
import { formatDate } from "@/lib/utils"
import { IconEdit, IconTrash, IconClipboardText, IconProgressCheck, IconProgressX, IconProgressHelp, IconAward } from "@tabler/icons-react"
import { DeleteConfirmDialog } from "../ui/DeleteConfirmDialog"
import StatusCard from "../ui/StatusCard"

export default function PlanHeaderCard({ plan, onDelete, showAction }) {
    return (
        <div className="bg-white rounded-sm p-3">
            <div className="flex justify-between items-center border-b pb-2">
                <div>
                    <h1 className="text-stone-400 font-bold">Detail Plan</h1>
                </div>
                <div className="flex gap-2">
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
                    </Link>
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

            <div className="grid grid-cols-2 pt-5 gap-2">
                <StatusCard label="Task" Icon={IconClipboardText} data={plan.totalTask} variant="natural" />
                <StatusCard label="Completed" Icon={IconProgressCheck} data={plan.totalCompleted} variant="success" />
                <StatusCard label="Uncompleted" Icon={IconProgressX} data={plan.totalUncompleted} variant="danger" />
                <StatusCard label="Pending" Icon={IconProgressHelp} data={plan.totalPending} variant="warning" />
                <StatusCard label="Points" Icon={IconAward} data={plan.totalPoints} variant="sky" />
            </div>
        </div>
    )
}