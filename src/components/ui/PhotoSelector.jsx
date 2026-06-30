import React, { useState, useEffect } from "react"
import { MyButton } from "@/components/ui/MyButton"
import { Spinner } from "@/components/ui/spinner"
import { IconPhoto, IconCheck, IconTrash, IconZoomIn, IconZoomOut } from "@tabler/icons-react"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"


export default function PhotoSelector({
    type,
    savedImage,
    previewUrl,
    isUploading,
    onFileChange,
    onUpload,
    onCancel,
    onDelete,
    onSave,
    itemId,
    isLoading,
    showAction,
    note: initialNote,
    showNote
}) {
    const [isZoomed, setIsZoomed] = useState(false)
    const [note, setNote] = useState(initialNote || "")
    useEffect(() => {
        setNote(initialNote || "")
    }, [initialNote])

    return (
        <div className="space-y-2 border-b pb-5">

            <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wider block">
                {type}
            </span>

            {showAction && (
                <div className=" text-sm text-stone-800 bg-amber-200 p-2 rounded-sm">
                    <label
                        htmlFor={`${type}-note`}
                        className="text-xs font-medium text-stone-600"
                    >
                        Note
                    </label>

                    <textarea
                        id={`${type}-note`}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={`Write ${type.toLowerCase()} note...`}
                        className=" w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-base placeholder:text-stone-400"
                    />

                    <MyButton
                        label={isLoading ? "Saving..." : "Save or Update"}
                        disabled={isLoading}
                        variant={isLoading ? "disable" : "success"}
                        w={'w-full'}
                        onClick={() => onSave(type, note)}
                    />
                </div>
            )}
            {previewUrl || savedImage ? (
                <Dialog onOpenChange={(open) => { if (!open) setIsZoomed(false) }}>
                    <DialogTrigger asChild>
                        <div className="relative flex flex-col items-center justify-center aspect-video rounded-lg border border-stone-200 bg-white overflow-hidden group transition-all cursor-pointer shadow-sm">
                            <img
                                src={previewUrl || savedImage.image_path}
                                alt={`${type} view`}
                                className="w-full h-full object-cover absolute inset-0"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                <IconZoomIn className="w-6 h-6 text-white drop-shadow" />
                            </div>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl bg-white/50 p-1 border-none flex flex-col items-center justify-center gap-0 overflow-hidden">
                        <DialogTitle className="hidden">{type} Photo Fullscreen</DialogTitle>
                        <DialogDescription className="hidden">Viewing documentation photo {type} action</DialogDescription>

                        <div
                            onClick={() => setIsZoomed(!isZoomed)}
                            className="relative w-full h-[80vh] flex items-center justify-center overflow-auto cursor-zoom-in"
                        >
                            <img
                                src={previewUrl || savedImage.image_path}
                                alt={`${type} View Full`}
                                className={`max-w-full max-h-full object-contain rounded transition-transform duration-300 ease-out ${isZoomed ? "scale-150 cursor-zoom-out" : ""}`}
                            />
                            <div className="absolute bottom-4 right-4 bg-black/50 text-white p-1.5 rounded-full backdrop-blur pointer-events-none">
                                {isZoomed ? <IconZoomOut className="w-4 h-4" /> : <IconZoomIn className="w-4 h-4" />}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            ) : (
                showAction ? (
                    <label htmlFor={`file-${type}-${itemId}`} className="relative flex flex-col items-center justify-center aspect-video rounded-lg border border-dashed border-stone-300 bg-white hover:bg-stone-50/50 overflow-hidden group transition-all cursor-pointer">
                        <div className="flex flex-col items-center gap-1 p-2 text-center">
                            <IconPhoto className="w-5 h-5 text-stone-400 group-hover:text-stone-500" />
                            <span className="text-[11px] text-stone-500 font-medium">Select Photo</span>
                        </div>
                        <input
                            id={`file-${type}-${itemId}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => onFileChange(e, type)}
                            disabled={isUploading}
                        />
                    </label>
                ) :
                    <div className="text-stone-400">No photo yet</div>

            )}

            {previewUrl && showAction && (
                <div className="flex gap-1.5 w-full">
                    <MyButton
                        label={isUploading ? "Uploading..." : "Save"}
                        variant={isUploading ? "disable" : "success"}
                        icon={isUploading ? Spinner : IconCheck}
                        disabled={isUploading}
                        onClick={() => onUpload(type)}
                    />
                    <MyButton
                        label="Cancel"
                        variant="w_outline"
                        className="border border-stone-200 shadow-sm"
                        disabled={isUploading}
                        onClick={() => onCancel(type)}
                    />
                </div>
            )}


            {savedImage && !previewUrl && showAction && (
                <MyButton
                    label={isUploading ? "Deleting..." : "Delete Permanent"}
                    variant={isUploading ? "disable" : "danger"}
                    className="w-full"
                    icon={isUploading ? Spinner : IconTrash}
                    disabled={isUploading}
                    onClick={() => onDelete(type)}
                    w='w-full'
                />
            )}

            {showNote &&(
                <div className="text-sm text-stone-800 bg-amber-200 p-2 rounded-sm ">
                    <div className="text-xs font-bold">{`Note for ${type}`}</div>
                    <div>{note || '-'}</div>
                </div>
            )}
        </div>
    )
}