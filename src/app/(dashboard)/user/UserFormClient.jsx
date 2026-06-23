"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MyButton } from "@/components/ui/MyButton";
import InputForm from "@/components/ui/InputForm";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox";

export default function UserFormClient({ dbRoles = [], dbBranches = [], currentUser = null }) {
    const isEditMode = !!currentUser;
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    const [form, setForm] = useState({
        username: currentUser?.username || "",
        password: "",
        name: currentUser?.name || "",
        id_branch: currentUser?.id_branch || "",
        id_role: currentUser?.id_role || "",
        isAdmin: currentUser?.isAdmin || false,
        isDelete: false
    });

    const save = async () => {
        if (!form.username || (!isEditMode && !form.password) || !form.name || !form.id_role) {
            toast.error("Fill all field!");
            return;
        }

        setLoading(true);
        try {
            const apiUrl = isEditMode ? `/api/user/${currentUser.id}` : "/api/user";
            const apiMethod = isEditMode ? "PUT" : "POST";

            const res = await fetch(apiUrl, {
                method: apiMethod,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const result = await res.json();

            if (res.ok && result.success) {
                toast.success(isEditMode ? "User updated successfully!" : "Success to create user!");

                router.push("/user")
                router.refresh()


                if (!isEditMode) {
                    setForm({
                        username: "",
                        password: "",
                        name: "",
                        id_branch: "",
                        id_role: "",
                        isAdmin: false,
                        isDelete: false
                    });
                }


            } else {
                toast.error(result.message || "Failed to save user");
            }

        } catch (error) {
            toast.error("Something went wrong", { description: `${error}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <div className="font-semibold text-lg">{isEditMode ? "Edit User" : "Add User"}</div>
                <Link href="/user">
                    <MyButton label="back" variant="white" />
                </Link>
            </div>

            <InputForm
                label="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Input username"
                required
            />

            <InputForm
                label={"Password"}
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={isEditMode ? "Kosongkan jika tidak diubah" : "Input password"}
                required={!isEditMode}
            />

            <InputForm
                label="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Input name"
                required
            />

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-stone-700">Role</label>
                <Combobox
                    items={dbRoles} // Oper array objek utuh
                    value={form.id_role ? String(form.id_role) : ""} // Ikat pakai string ID murni
                    onValueChange={(val) => {
                        setForm({ ...form, id_role: val ? Number(val) : "" });
                    }}
                >
                    <ComboboxInput
                        placeholder="Select a Role"
                        className="bg-white"
                        value={dbRoles.find((r) => r.id === form.id_role)?.role || ""}
                    />
                    <ComboboxContent>
                        <ComboboxEmpty>No roles found.</ComboboxEmpty>
                        <ComboboxList>
                            {(item) => (
                                <ComboboxItem key={item.id} value={String(item.id)}>
                                    {item.role}
                                </ComboboxItem>
                            )}
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-stone-700">Branch</label>
                <Combobox
                    items={dbBranches}
                    value={form.id_branch ? String(form.id_branch) : ""}
                    onValueChange={(val) => {
                        setForm({ ...form, id_branch: val ? Number(val) : "" });
                    }}
                >
                    <ComboboxInput
                        placeholder="Select a branch"
                        className="bg-white"
                        value={dbBranches.find((b) => b.id === form.id_branch)?.name || ""}
                    />
                    <ComboboxContent>
                        <ComboboxEmpty>No branch found.</ComboboxEmpty>
                        <ComboboxList>
                            {(item) => (
                                <ComboboxItem key={item.id} value={String(item.id)}>
                                    {item.name}
                                </ComboboxItem>
                            )}
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>
            </div>

            <div className="flex gap-4 my-2">
                <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={form.isAdmin}
                        onChange={(e) => setForm({ ...form, isAdmin: e.target.checked })}
                    />
                    Admin
                </label>
            </div>

            <MyButton
                label={loading ? "Updating..." : isEditMode ? "Update User" : "Save User"}
                onClick={save}
                variant={loading ? "disable" : "primary"}
            />
        </div>
    );
}