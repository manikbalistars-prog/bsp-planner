import React from "react"
import { MyButton } from "@/components/ui/MyButton"
import { formatDate } from "@/lib/utils"
import { IconClock, IconEdit, IconTrash } from "@tabler/icons-react"

const getStatusStyles = (status) => {
    switch (status) {
        case "completed": return "border-emerald-200 bg-emerald-50 text-emerald-800"
        case "uncompleted": return "border-rose-200 bg-rose-50 text-rose-800"
        case "pending":
        default: return "border-amber-200 bg-amber-50 text-amber-800"
    }
}

const getStatusLabel = (status) => {
    switch (status) {
        case "completed": return "Completed"
        case "uncompleted": return "Uncompleted"
        case "pending":
        default: return "Pending"
    }
}

export default function PlanItemCard({ item, isExpanded, onToggle, onEdit, onDelete }) {
    return (
        <div
            onClick={onToggle}
            className={`overflow-hidden rounded-xl border transition-all cursor-pointer ${getStatusStyles(item.status)} ${isExpanded ? "shadow-sm" : "hover:shadow-sm"}`}
        >
            <div className="flex items-start justify-between gap-3 p-4 pb-2">
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col items-start gap-2 flex-wrap">
                        <span className="text-xs font-semibold uppercase tracking-wide opacity-80">
                            {getStatusLabel(item.status)}
                        </span>
                        <span className="text-xs flex items-center gap-1 opacity-80">
                            <IconClock className="w-3.5 h-3.5" />
                            {item.time?.slice(0, 5)}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <MyButton
                        iconOnly
                        icon={IconEdit}
                        variant="warning"
                        onClick={() => onEdit(item)}
                    />
                    <MyButton
                        iconOnly
                        icon={IconTrash}
                        variant="danger"
                        onClick={() => onDelete(item)}
                    />
                </div>
            </div>

            <div className="px-4 pb-4 pt-1">
                <div className={`text-sm font-medium text-stone-900 ${isExpanded ? "line-clamp-none" : "line-clamp-1"}`}>
                    {item.description}
                </div>
            </div>

            <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="overflow-hidden">
                    <div className="border-t border-black/5 bg-white/70 p-4">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div className="space-y-4">
                                <div className="rounded-xl bg-stone-50 p-4">
                                    <div className="text-xs text-stone-400">Time</div>
                                    <div className="mt-1 text-base font-semibold text-stone-900">{item.time?.slice(0, 5)}</div>
                                </div>
                                <div className="rounded-xl bg-stone-50 p-4">
                                    <div className="text-xs text-stone-400">Description</div>
                                    <div className="mt-1 text-sm text-stone-800 leading-6 whitespace-pre-wrap">{item.description}</div>
                                </div>

                            </div>
                            <div className="space-y-4">
                                <div className="rounded-xl bg-stone-50 p-4">
                                    <div className="text-xs text-stone-400">Marked By</div>
                                    <div className="mt-1 text-sm font-medium text-stone-900">{item.marked_by || "Not marked yet"}</div>
                                </div>
                                <div className="rounded-xl bg-stone-50 p-4">
                                    <div className="text-xs text-stone-400">Marked At</div>
                                    <div className="mt-1 text-sm font-medium text-stone-900">
                                        {item.marked_at ? formatDate(item.marked_at, true) : "Not marked yet"}
                                    </div>
                                </div>
                                <div className="rounded-xl bg-stone-50 p-4">
                                    <div className="text-xs text-stone-400">Note</div>
                                    <div className="mt-1 text-sm text-stone-600 italic whitespace-pre-wrap">{item.note || "No note yet."}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}