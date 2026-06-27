"use client"

import { MyButton } from "@/components/ui/MyButton"
import { useState, useEffect } from "react"
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell
} from "@/components/ui/table"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"
import { IconEdit, IconTrash, IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

import { useAuth } from "@/context/AuthContext"
import { DeleteConfirmDialog } from "@/components/ui/DeleteConfirmDialog"

export default function Users() {
    const [users, setUsers] = useState([])
    const [page, setPage] = useState(1);

    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const { currentUser } = useAuth()

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/user?page=${page}&limit=${limit}&search=${debouncedSearch}`);
            const data = await res.json();
            if (data.success) {
                setUsers(data.users);
                setTotalPages(data.totalPages);
            }
        } catch (err) {
            toast.error("failed to fetching data", {
                description: err.message || "Something went wrong"
            })
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async (id, name) => {
        if (!currentUser?.isAdmin) {
            toast.error("You don't have access for that action!");
            return
        }
        try {
            const res = await fetch(`/api/user/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (res.ok && data.success) {
                toast.success(`User "${name}" success deleted!`);
                loadUsers();
            } else {
                toast.error(data.message || "Fail to delete user!");
            }
        } catch (err) {
            toast.error("Something went wrong", { description: err.message });
        }
    };

    useEffect(() => {
        if (search === "" && debouncedSearch === "") return;
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    useEffect(() => {
        loadUsers();
    }, [page, debouncedSearch, limit]);

    return (
        <div className="flex flex-col gap-2 px-2">
            <div className="flex justify-between">
                <p className="font-semibold text-stone-800">All users </p>

                {currentUser?.isAdmin && (
                    <Link href="/user/create"><MyButton label="add user"></MyButton></Link>
                )}
            </div>

            <div className="flex gap-2 flex-wrap">
                <div className="flex flex-col gap-2 text-sm text-stone-600 shrink-0 ">
                    <span>Search</span>
                    <input
                        type="text"
                        placeholder="Search users by name..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full sm:w-64 px-3 py-1.5 text-sm rounded-md border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-stone-500/20 focus:border-stone-500"
                    />
                </div>

                <div className="flex flex-col gap-2 text-sm text-stone-600 shrink-0">
                    <span>Show</span>
                    <select
                        value={limit}
                        onChange={(e) => {
                            setLimit(Number(e.target.value));
                            setPage(1);
                        }}
                        className="px-2 py-1.5 bg-white border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500/20"
                    >
                        <option value={5}>5 </option>
                        <option value={10}>10 </option>
                        <option value={25}>25 </option>
                        <option value={50}>50 </option>
                    </select>
                </div>
            </div>

            <div className="bg-white p-2 rounded-lg border border-stone-100">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Branch</TableHead>
                            <TableHead>Role</TableHead>
                            {currentUser?.isAdmin && (<TableHead>Username</TableHead>)}
                            {currentUser?.isAdmin && (<TableHead className="text-center">Action</TableHead>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center">
                                    <div className="flex justify-center items-center gap-2">
                                        <Spinner />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-sm text-stone-400">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.branch?.name || "-"}</TableCell>
                                    <TableCell>{user.role?.role || "-"}</TableCell>
                                    {currentUser?.isAdmin && (<TableCell>{user.username || "-"}</TableCell>)}
                                    {currentUser?.isAdmin && (
                                        <TableCell>
                                            <div className="flex gap-2 items-center justify-center">
                                                <Link href={`/user/edit?id=${user.id}`}>
                                                    <MyButton iconOnly icon={IconEdit} variant="warning"></MyButton>
                                                </Link>

                                                <DeleteConfirmDialog
                                                    title="Delete User"
                                                    description={
                                                        <>
                                                            Are you sure you want to delete <span className="font-semibold text-stone-800">"{user.name}"</span>?
                                                        </>
                                                    }
                                                    onConfirm={() => handleDelete(user.id, user.name)}
                                                    trigger={<MyButton iconOnly icon={IconTrash} variant="danger" className="w-fit" />}
                                                />
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-between items-center px-2 bg-white p-3 rounded-lg border border-stone-100">
                <p className="text-xs sm:text-sm text-stone-500 font-medium">
                    Page <span className="text-stone-800">{page}</span> of <span className="text-stone-800">{totalPages}</span>
                </p>

                <div className="flex items-center gap-1.5">
                    <MyButton
                        icon={IconChevronLeft}
                        iconOnly
                        variant={page === 1 ? "disable" : "white"}
                        disabled={page === 1}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    />
                    <MyButton
                        icon={IconChevronRight}
                        iconOnly
                        variant={(page === totalPages || totalPages === 0) ? "disable" : "white"}
                        disabled={page === totalPages || totalPages === 0}
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    />
                </div>
            </div>
        </div>
    )
}