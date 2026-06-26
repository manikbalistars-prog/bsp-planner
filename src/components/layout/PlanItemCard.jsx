import React, { useState } from "react"
import { MyButton } from "@/components/ui/MyButton"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { IconClock, IconEdit, IconTrash, IconPhoto, IconX } from "@tabler/icons-react"
import { DeleteConfirmDialog } from "../ui/DeleteConfirmDialog"

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

export default function PlanItemCard({ item, isExpanded, onToggle, onEdit, onDelete, onRefresh }) {
    const [uploadingBefore, setUploadingBefore] = useState(false)
    const [uploadingAfter, setUploadingAfter] = useState(false)

    const imageBefore = item.images?.find(img => img.image_type === 'before') || null
    const imageAfter = item.images?.find(img => img.image_type === 'after') || null

    const handlePhotoUpload = async (e, type) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (type === 'before') setUploadingBefore(true)
        if (type === 'after') setUploadingAfter(true)

        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("id_item", item.id)
            formData.append("image_type", type)

            const res = await fetch("/api/plan/item/image", {
                method: "POST",
                body: formData,
            })

            const data = await res.json()
            if (!res.ok || !data.success) throw new Error(data.message || "Failed to upload image")

            toast.success(`Photo ${type} uploaded successfully`)
            if (onRefresh) onRefresh()
        } catch (err) {
            toast.error("Upload failed", { description: err.message })
        } finally {
            setUploadingBefore(false)
            setUploadingAfter(false)
        }
    }

    const handlePhotoDelete = async (type) => {
        if (type === 'before') setUploadingBefore(true)
        if (type === 'after') setUploadingAfter(true)

        try {
            const res = await fetch("/api/plan/item/image", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_item: item.id,
                    image_type: type
                })
            })

            const data = await res.json()
            if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete image")

            toast.success(`Photo ${type} deleted successfully`)
            if (onRefresh) onRefresh()
        } catch (err) {
            toast.error("Delete failed", { description: err.message })
        } finally {
            setUploadingBefore(false)
            setUploadingAfter(false)
        }
    }
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
                    <DeleteConfirmDialog
                        title="Delete User"
                        description="Are you sure you want to delete this?"
                        onConfirm={() => onDelete(item)}
                        trigger={<MyButton
                            iconOnly
                            icon={IconTrash}
                            variant="danger"

                        />}
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
                                    <div className="text-xs text-stone-400 mb-2">Documentation Photos</div>

                                    <div className="grid grid-cols-1 gap-3">
                                
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wider block">Before</span>
                                            <label className="relative flex flex-col items-center justify-center aspect-video rounded-lg border border-dashed border-stone-300 bg-white hover:bg-stone-50/50 cursor-pointer overflow-hidden group transition-all">
                                                {uploadingBefore ? (
                                                    <Spinner className="w-5 h-5 text-stone-400" />
                                                ) : imageBefore ? (
                                                    <>
                                                        <img src={imageBefore.image_path} alt="Before" className="w-full h-full object-cover absolute inset-0" />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.preventDefault(); handlePhotoDelete('before'); }}
                                                            className="absolute top-1.5 right-1.5 p-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                        >
                                                            <IconX className="w-3.5 h-3.5" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-1 p-2 text-center">
                                                        <IconPhoto className="w-5 h-5 text-stone-400 group-hover:text-stone-500" />
                                                        <span className="text-[11px] text-stone-500 font-medium">Upload</span>
                                                    </div>
                                                )}
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e, 'before')} disabled={uploadingBefore} />
                                            </label>
                                        </div>

                                        
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wider block">After</span>
                                            <label className="relative flex flex-col items-center justify-center aspect-video rounded-lg border border-dashed border-stone-300 bg-white hover:bg-stone-50/50 cursor-pointer overflow-hidden group transition-all">
                                                {uploadingAfter ? (
                                                    <Spinner className="w-5 h-5 text-stone-400" />
                                                ) : imageAfter ? (
                                                    <>
                                                        <img src={imageAfter.image_path} alt="After" className="w-full h-full object-cover absolute inset-0" />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.preventDefault(); handlePhotoDelete('after'); }}
                                                            className="absolute top-1.5 right-1.5 p-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                        >
                                                            <IconX className="w-3.5 h-3.5" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-1 p-2 text-center">
                                                        <IconPhoto className="w-5 h-5 text-stone-400 group-hover:text-stone-500" />
                                                        <span className="text-[11px] text-stone-500 font-medium">Upload</span>
                                                    </div>
                                                )}
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e, 'after')} disabled={uploadingAfter} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}