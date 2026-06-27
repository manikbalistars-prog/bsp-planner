import React, { useState } from "react"
import { MyButton } from "@/components/ui/MyButton"
import { formatDate, formatTime } from "@/lib/utils"
import { toast } from "sonner"
import { IconClock, IconEdit, IconTrash, IconCheck, IconX } from "@tabler/icons-react"
import { DeleteConfirmDialog } from "../ui/DeleteConfirmDialog"
import imageCompression from "browser-image-compression"

import PhotoSelector from "@/components/ui/PhotoSelector"
import { Spinner } from "../ui/spinner"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

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

export default function PlanItemCard({ id_user_plan, item, isExpanded, onToggle, onEdit, onDelete, onRefresh, showAction }) {

    const { currentUser } = useAuth()

    const router = useRouter()
    const [uploadingBefore, setUploadingBefore] = useState(false)
    const [uploadingAfter, setUploadingAfter] = useState(false)

    const [tempBeforeFile, setTempBeforeFile] = useState(null)
    const [tempAfterFile, setTempAfterFile] = useState(null)
    const [previewBefore, setPreviewBefore] = useState(null)
    const [previewAfter, setPreviewAfter] = useState(null)

    const [isLoading, setIsLoading] = useState(false)


    const imageBefore = item.images?.find(img => img.image_type === 'before') || null
    const imageAfter = item.images?.find(img => img.image_type === 'after') || null


    const handleFileChange = async (e, type) => {
        const file = e.target.files?.[0]
        if (!file) return

        const toastId = toast.loading("Compressing image...")

        const options = {
            maxSizeMB: 0.4,
            maxWidthOrHeight: 1200,
            useWebWorker: true,
            fileType: "image/webp"
        }

        try {

            const compressedFile = await imageCompression(file, options)

            const objectUrl = URL.createObjectURL(compressedFile)
            if (type === 'before') {
                setTempBeforeFile(compressedFile)
                setPreviewBefore(objectUrl)
            } else {
                setTempAfterFile(compressedFile)
                setPreviewAfter(objectUrl)
            }

            toast.success("Image optimized successfully", { id: toastId })
        } catch (error) {
            toast.error("Failed to compress image", { id: toastId })
        }
    }

    const handlePhotoUpload = async (type) => {
        const file = type === 'before' ? tempBeforeFile : tempAfterFile
        if (!file) return

        if (type === 'before') setUploadingBefore(true)
        if (type === 'after') setUploadingAfter(true)

        try {
            const formData = new FormData()
            formData.append('id_user_plan', id_user_plan)
            formData.append("file", file)
            formData.append("id_item", item.id)
            formData.append("image_type", type)

            const res = await fetch("/api/plan/item/image", {
                method: "POST",
                body: formData,
            })

            const data = await res.json()
            const msg =
                data.message === "Unauthorized"
                    ? "You dont have access to upload here"
                    : "Fail to upload image!";
            if (!res.ok) {
                toast.error(msg, { description: `error : ${data.message}` });
                return;
            }
            toast.success(`Photo ${type} uploaded successfully`)

            if (type === 'before') {
                setTempBeforeFile(null)
                setPreviewBefore(null)
            } else {
                setTempAfterFile(null)
                setPreviewAfter(null)
            }
            if (onRefresh) onRefresh()
        } catch (err) {
            toast.error("Upload failed", { description: err.message })
        } finally {
            setUploadingBefore(false)
            setUploadingAfter(false)
        }
    }

    const handleCancelTemp = (type) => {
        if (type === 'before') {
            setTempBeforeFile(null)
            setPreviewBefore(null)
        } else {
            setTempAfterFile(null)
            setPreviewAfter(null)
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
                    id_user_plan: id_user_plan,
                    id_item: item.id,
                    image_type: type
                })
            })

            const data = await res.json()
            const msg =
                data.message === "Unauthorized"
                    ? "You dont have access to delete this"
                    : "Fail to delete image!";
            if (!res.ok) {
                toast.error(msg, { description: `error : ${data.message}` });
                return;
            }

            toast.success(`Photo ${type} deleted successfully`)
            if (onRefresh) onRefresh()
        } catch (err) {
            toast.error("Delete failed", { description: err.message })
        } finally {
            setUploadingBefore(false)
            setUploadingAfter(false)
        }
    }


    const handleUpdateStatus = async (status) => {

        setIsLoading(true)
        try {
            const res = await fetch(`/api/plan/item/status/${item.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: item.id,
                    status: status,
                    marked_by: currentUser.id,
                    marked_at: new Date()
                }),
            })



            const data = await res.json()
            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to update status")
            }
            toast.success("Item updated successfully")

            if (onRefresh) {
                await onRefresh();
            }

        } catch (error) {
            toast.error("Update status failed", { description: error.message })
        } finally {
            setIsLoading(false)
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

                {showAction && (
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
                )}
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

                                <div className="rounded-xl bg-stone-50 p-4">
                                    <div className="text-xs text-stone-400">Marked By</div>
                                    <div className="mt-1 text-sm font-medium text-stone-900">{item.marked_by?.name || "Not marked yet"}</div>
                                </div>
                                <div className="rounded-xl bg-stone-50 p-4">
                                    <div className="text-xs text-stone-400">Marked At</div>
                                    <div className="mt-1 text-sm font-medium text-stone-900">
                                        {item.marked_at ? formatDate(item.marked_at, true) : "Not marked yet"}
                                    </div>
                                    <div className="mt-1 text-xs text-stone-400">
                                        {item.marked_at ? formatTime(item.marked_at) : ""}
                                    </div>
                                </div>

                            </div>
                            <div className="space-y-4">
                                <div className="rounded-xl bg-stone-50 p-4">
                                    <div className="text-xs text-stone-400 mb-2">Documentation Photos</div>
                                    <div className="grid grid-cols-1 gap-4">

                                        <PhotoSelector
                                            type="before"
                                            savedImage={imageBefore}
                                            previewUrl={previewBefore}
                                            isUploading={uploadingBefore}
                                            onFileChange={handleFileChange}
                                            onUpload={handlePhotoUpload}
                                            onCancel={handleCancelTemp}
                                            onDelete={handlePhotoDelete}
                                            itemId={item.id}
                                            showAction={showAction}
                                        />

                                        <PhotoSelector
                                            type="after"
                                            savedImage={imageAfter}
                                            previewUrl={previewAfter}
                                            isUploading={uploadingAfter}
                                            onFileChange={handleFileChange}
                                            onUpload={handlePhotoUpload}
                                            onCancel={handleCancelTemp}
                                            onDelete={handlePhotoDelete}
                                            itemId={item.id}
                                            showAction={showAction}
                                        />
                                    </div>

                                </div>

                                {!showAction && (
                                    <div className="rounded-xl bg-stone-50 p-4">
                                        <div className="text-xs text-stone-400">
                                            {isLoading ? <div className="flex gap-2">Changing status <span><Spinner /></span></div> : <div>Change Status</div>}
                                        </div>
                                        <div className="flex h-fit gap-2 pt-2">
                                            <MyButton iconOnly icon={IconCheck} variant={item.status == "completed" || isLoading ? "disable" : "success"} onClick={() => handleUpdateStatus('completed')} />
                                            <MyButton iconOnly icon={IconX} variant={item.status == "uncompleted" || isLoading ? "disable" : "danger"} onClick={() => handleUpdateStatus('uncompleted')} />
                                            <MyButton iconOnly icon={IconClock} variant={item.status == "pending" || isLoading ? "disable" : "warning"} onClick={() => handleUpdateStatus('pending')} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}