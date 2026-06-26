"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import InputForm from "@/components/ui/InputForm"
import { Textarea } from "@/components/ui/textarea"
import { MyButton } from "@/components/ui/MyButton"
import { toast } from "sonner"

const defaultValues = {
    time: "",
    description: "",
}

export default function ItemInputDialog({
    trigger,
    title = "Add Item",
    subtitle = "Fill item time and description.",
    submitLabel = "Save",
    cancelLabel = "Cancel",
    initialValues,
    open,
    onOpenChange,
    onSubmit,
    loading = false,
}) {
    const isControlled = typeof open === "boolean"
    const [internalOpen, setInternalOpen] = useState(false)

    const mergedInitialValues = useMemo(() => {
        return {
            ...defaultValues,
            ...(initialValues || {}),
        }
    }, [initialValues])

    const [form, setForm] = useState(mergedInitialValues)

    const currentOpen = isControlled ? open : internalOpen
    const setOpen = onOpenChange || setInternalOpen

    useEffect(() => {
        if (currentOpen) {
            setForm(mergedInitialValues)
        }
    }, [currentOpen, mergedInitialValues])

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!form.time.trim() || !form.description.trim()) {
            toast.error("Fill all field")
            return
        }

        onSubmit?.({
            time: form.time,
            description: form.description,
        })
    }

    const openTimePicker = (e) => {
        const input = e.currentTarget

        if (!input.showPicker) {
            return
        }

        e.preventDefault()
        input.showPicker()
    }

    return (
        <AlertDialog open={currentOpen} onOpenChange={setOpen}>
            {trigger ? <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger> : null}
            <AlertDialogContent size="default" className="max-w-md">
                <AlertDialogHeader className="items-start text-left">
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{subtitle}</AlertDialogDescription>
                </AlertDialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <InputForm
                            label="Time"
                            name="time"
                            type="time"
                            value={form.time}
                            onPointerDown={openTimePicker}
                            onChange={(e) => setForm((prev) => ({ ...prev, time: e.target.value }))}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="description" className="text-stone-600">
                            Description*
                        </label>
                        <Textarea
                            id="description"
                            name="description"
                            rows={4}
                            placeholder="Input description"
                            value={form.description}
                            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <MyButton
                            label={cancelLabel}
                            variant="white"
                            type="button"
                            onClick={() => setOpen(false)}
                        />
                        <MyButton
                            label={loading ? "Processing..." : submitLabel}
                            variant={loading ? "disable" : "success"}
                            type="submit"
                            disabled={loading}
                        />
                    </div>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    )
}
