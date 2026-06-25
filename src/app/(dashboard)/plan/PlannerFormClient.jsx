'use client'
import InputForm from "@/components/ui/InputForm"
import Link from "next/link"
import { MyButton } from "@/components/ui/MyButton"
import { Calendar } from "@/components/ui/calendar"

import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation";

export default function PlannerFormClient({ currentPlan = null }) {
    const isEditMode = !!currentPlan;
    const [loading, setLoading] = useState(false)


    const router = useRouter()

    const [form, setForm] = useState({
        title: currentPlan?.title || "",
        date: currentPlan?.date ? new Date(currentPlan.date) : undefined,
    })

    const [errors, setErrors] = useState({
        title: "",
        date: "",
    })

    const updateField = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }))

        setErrors((prev) => ({
            ...prev,
            [field]: "",
        }))
    }

    const save = async () => {
        const nextErrors = {
            title: form.title.trim() ? "" : "Title is required",
            date: form.date ? "" : "Date is required",
        }

        setErrors(nextErrors)

        if (nextErrors.title || nextErrors.date) {
            toast.error("Fill all field")
            return
        }

        setLoading(true)
        try {

            const apiUrl = isEditMode ? `/api/plan/${currentPlan.id}` : `/api/plan`;
            const apiMethod = isEditMode ? "PUT" : "POST";
            const payloadBody = isEditMode
                ? { id: currentPlan.id, id_user:currentPlan.id_user, ...form }
                : form;

            const res = await fetch(apiUrl, {
                method: apiMethod,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payloadBody),
            })

            const result = await res.json()

            if (res.ok && result.success) {
                toast.success(isEditMode ? "Plan updated successfully!" : "Success to create plan!");
                const savedPlanId = result.plan?.id || currentPlan?.id
                if (savedPlanId) {
                    router.push(`/plan/detail?id=${savedPlanId}`)
                } else {
                    router.push("/plan")
                }
            } else {
                toast.error(result.message || "Failed to save data");
            }

        } catch (error) {
            toast.error("Something went wrong", { description: `${error}` });
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className="p-3 flex flex-col bg-white rounded-lg">
            <div className="flex justify-between items-center border-b pb-3">
                <div className="font-semibold text-stone-800">{isEditMode ? "Edit Plan" : "Add Plan"}</div>
                <div className=" flex gap-2 flex-wrap">
                    <Link href="/plan"><MyButton label="back" /></Link>
                    <MyButton
                        label={loading ? "processing..." : isEditMode ? "update" : "submit"}
                        onClick={save}
                        variant={loading ? "disable" : "success"}
                    />
                </div>
            </div>
            <div className="pt-5 flex flex-col gap-5">
                <InputForm
                    label="Title"
                    required
                    placeholder="Input title activty"
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className={errors.title ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""}
                />
                {errors.title && <p className="-mt-3 text-xs text-red-500">{errors.title}</p>}

                <div className="flex flex-col gap-1">
                    <label className="text-stone-600">Select Date*</label>
                    < Calendar mode="single"
                        selected={form.date}
                        onSelect={(selected) => updateField("date", selected)}
                        className="w-full border-stone-200 border rounded-lg sm:max-w-fit"
                        captionLayout="dropdown" /></div>
                {errors.date && <p className="-mt-3 text-xs text-red-500">{errors.date}</p>}
            </div>

        </div>
    )
}