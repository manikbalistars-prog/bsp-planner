"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MyButton } from "@/components/ui/MyButton"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { IconClipboardPlus } from "@tabler/icons-react"
import Link from "next/link"
import ItemInputDialog from "@/components/ui/ItemInputDialog"

import PlanHeaderCard from "@/components/layout/PlanHeader"
import PlanItemCard from "@/components/layout/PlanItemCard"



export default function PlanDetail() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [loading, setLoading] = useState(true);
    const [itemDialogOpen, setItemDialogOpen] = useState(false)
    const [itemLoading, setItemLoading] = useState(false)
    const [plan, setPlan] = useState(null)
    const [items, setItems] = useState([])
    const [expandedItemId, setExpandedItemId] = useState(null)
    const [editingItem, setEditingItem] = useState(null)

    const loadPlan = async (id) => {
        setLoading(true)
        try {
            const res = await fetch(`/api/plan/${id}`)
            const data = await res.json()

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to load plan")
            }
            setPlan(data.plan)
            setItems(data.plan.items || [])
            // setExpandedItemId((prev) => prev || data.item?.[0]?.id || null)
        } catch (err) {
            toast.error("Failed to load plan", { description: err.message });
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const id = searchParams.get("id")
        if (!id) {
            setLoading(false)
            toast.error("Plan ID is missing")
            return
        }
        loadPlan(id)
    }, [searchParams])

    const handleItemEdit = (item) => {
        setEditingItem(item)
        setItemDialogOpen(true)
    }

    const handleItemDelete = async (item) => {
        try {
            const res = await fetch(`/api/plan/item/${item.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: item.id,
                    id_user_plan: plan.user.id,
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

            setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));

            if (expandedItemId === item.id) {
                setExpandedItemId(null);
            }

        } catch (err) {
            toast.error("Something went wrong", { description: `${err}` });
        }
    }

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
            if (data.item) {
                setItems((prevItems) => {
                    const updatedItems = [...prevItems, data.item];

                    return updatedItems.sort((a, b) => (a.time || "").localeCompare(b.time || ""));
                });
            }
        } catch (err) {
            toast.error("Failed to add item", { description: err.message })
        } finally {
            setItemLoading(false)
        }
    }

    const handleUpdateItem = async ({ time, description }) => {
        if (!editingItem?.id || !plan?.user?.id) return

        setItemLoading(true)
        try {
            const res = await fetch(`/api/plan/item/${editingItem.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editingItem.id,
                    id_user_plan: plan.user.id,
                    time,
                    description,
                }),
            })
            const data = await res.json()

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to update item")
            }

            toast.success("Item updated successfully")
            setItemDialogOpen(false)
            setEditingItem(null)
            setItems((prevItems) => {
                const updatedItems = prevItems.map((item) => {
                    if (item.id === editingItem.id) {
                        return { ...item, time, description };
                    }
                    return item;
                });

                return updatedItems.sort((a, b) => (a.time || "").localeCompare(b.time || ""));
            });
        } catch (err) {
            toast.error("Failed to update item", { description: err.message })
        } finally {
            setItemLoading(false)
        }
    }

    const handleOpenAddDialog = () => {
        setEditingItem(null)
        setItemDialogOpen(true)
    }


    if (loading) {
        return (
            <div className="flex justify-center items-center h-32 w-full gap-2">
                <Spinner />
            </div>
        )
    }

    if (!plan) {
        return (
            <div className="flex flex-col items-center justify-center h-32 w-full gap-3 bg-white rounded-sm p-3">
                <div className="text-sm text-stone-500">Plan data is not available.</div>
                <Link href="/plan">
                    <MyButton label="back" variant="primary" />
                </Link>
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="flex flex-col gap-2">
                <PlanHeaderCard onDelete={handleDelete} plan={plan} />

                <div className="bg-white rounded-sm p-3 flex flex-col gap-5">
                    <div className="flex">
                        <ItemInputDialog
                            trigger={<MyButton label="Add Activity" variant="success" icon={IconClipboardPlus} iconPosition="right" onClick={handleOpenAddDialog} />}
                            title={editingItem ? "Edit Item" : "Add Item"}
                            subtitle={editingItem ? "Modify item time and description." : "Fill item time and description."}
                            initialValues={editingItem ? { time: editingItem.time?.slice(0, 5), description: editingItem.description } : null}
                            open={itemDialogOpen}
                            onOpenChange={(open) => {
                                setItemDialogOpen(open)
                                if (!open) setEditingItem(null)
                            }}
                            onSubmit={editingItem ? handleUpdateItem : handleCreateItem}
                            loading={itemLoading}
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div>
                                <h2 className="text-sm font-semibold text-stone-800">Plan Items</h2>
                                <p className="text-xs text-stone-500">Click an item to see full details.</p>
                            </div>
                            <div className="text-xs text-stone-400">{items.length} items</div>
                        </div>

                        {items.length ? (
                            <div className="grid grid-cols-1 gap-3">
                                {items.map((item) => {
                                    return (
                                        <PlanItemCard
                                            key={item.id}
                                            item={item}
                                            isExpanded={expandedItemId == item.id}
                                            onToggle={() => setExpandedItemId((prev) => (prev === item.id ? null : item.id))}
                                            onEdit={handleItemEdit}
                                            onDelete={handleItemDelete}
                                            onRefresh={() => loadPlan(plan.id)}
                                        />
                                    )

                                })}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50 p-5 text-center text-sm text-stone-500">
                                No activity item yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )

}