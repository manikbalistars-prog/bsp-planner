'use client'
import { MyButton } from "@/components/ui/MyButton"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/context/AuthContext"
import { useState, useEffect } from "react"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"

import { IconChevronLeft, IconChevronRight, IconExternalLink } from "@tabler/icons-react"
import { useRouter } from "next/navigation"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"

export default function PlanItemsTable() {
    const { currentUser } = useAuth()
    const router = useRouter()

    useEffect(() => {
      
        if (currentUser) {
            if (currentUser.role?.role === "kepala cabang") {
              
                toast.error("Rejected", {
                    description: "You don't have access for this!"
                })

                router.replace("/dashboard")
            }
        }
    }, [currentUser, router])

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(50)
    const [totalPages, setTotalPages] = useState(1)
    const [totalData, setTotalData] = useState(0)
    const [loading, setLoading] = useState(false)

    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")

    const [data, setData] = useState([])
    const [users, setUsers] = useState([])

    const [selectedUser, setSelectedUser] = useState("")
    const [statusFilter, setStatusFilter] = useState("")

    const loadData = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(limit),
                search: debouncedSearch,
            })

            if (selectedUser) params.append("id_user", selectedUser)
            if (statusFilter) params.append("status", statusFilter)

            const itemPromise = fetch(`/api/plan/item?${params}`)

            const userPromise = currentUser?.role?.role !== "kepala cabang"
                ? fetch("/api/user?all=true")
                : Promise.resolve(null)

            const [itemRes, userRes] = await Promise.all([itemPromise, userPromise])
            const itemData = await itemRes.json()

            if (itemData.success) {
                setData(itemData.data)
                setTotalPages(itemData.totalPages)
                setTotalData(itemData.totalData)
            }

            if (userRes) {
                const userData = await userRes.json()
                if (userData.success) {
                    setUsers(userData.users)
                }
            }
        } catch (error) {
            toast.error("Failed to fetch data", {
                description: error.message || "Something went wrong"
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search)
            setPage(1)
        }, 500)
        return () => clearTimeout(handler)
    }, [search])

    useEffect(() => {
        loadData()
    }, [page, debouncedSearch, limit, selectedUser, statusFilter])

    const handleNavigateToPlanDetail = (idPlan) => {
        if (idPlan) {
            router.push(`/plan/detail?id=${idPlan}`)
        }
    }


    const getStatusBadge = (status) => {
        switch (status) {
            case "completed":
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 uppercase">Completed</span>
            case "pending":
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 uppercase">Pending</span>
            default:
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-stone-100 text-stone-700 uppercase">{status}</span>
        }
    }

    return (
        <div className="flex flex-col gap-4">

            <div className="bg-white p-4 rounded-lg border border-stone-100 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <p className="font-semibold text-stone-700 text-lg">All Activities / Plan Items</p>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                    {/* Search */}
                    <div className="flex flex-col gap-1.5 text-sm text-stone-500">
                        <span>Search Description</span>
                        <input
                            type="text"
                            placeholder="Search activity..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-3 py-1.5 text-stone-800 text-sm rounded-md border border-stone-200 bg-white focus:outline-none focus:border-stone-400"
                        />
                    </div>


                    <div className="flex flex-col gap-1.5 text-sm text-stone-500">
                        <span>Show</span>
                        <select
                            value={limit}
                            onChange={(e) => {
                                setLimit(Number(e.target.value))
                                setPage(1)
                            }}
                            className="w-full px-3 py-1.5 text-stone-800 text-sm rounded-md border border-stone-200 bg-white focus:outline-none focus:border-stone-400"
                        >
                            <option value={50}>50 Rows</option>
                            <option value={100}>100 Rows</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5 text-sm text-stone-500">
                        <span>Status</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value)
                                setPage(1)
                            }}
                            className="w-full px-3 py-1.5 text-stone-800 text-sm rounded-md border border-stone-200 bg-white focus:outline-none focus:border-stone-400"
                        >
                            <option value="">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>

                    {/* Filter User */}
                    {currentUser.role?.role !== "kepala cabang" && (
                        <div className="flex flex-col gap-1.5 text-sm text-stone-500">
                            <span>Filter by User</span>
                            <Combobox
                                items={users}
                                value={selectedUser}
                                onValueChange={(value) => {
                                    setSelectedUser(value)
                                    setPage(1)
                                }}
                            >
                                <ComboboxInput
                                    placeholder="Select a user"
                                    className="bg-white"
                                    value={users.find((u) => String(u.id) === selectedUser)?.name || ""}
                                />
                                <ComboboxContent>
                                    <ComboboxEmpty>No user found.</ComboboxEmpty>
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
                    )}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-stone-100 text-xs text-stone-400">
                    <div>Total Records: <span className="text-stone-700 font-medium">{totalData}</span></div>
                    {(selectedUser || statusFilter) && (
                        <MyButton
                            label="Clear Filter"
                            variant="netral"
                            onClick={() => {
                                setSelectedUser('')
                                setStatusFilter('')
                                setSearch('')
                                setPage(1)
                            }}
                        />
                    )}
                </div>
            </div>


            <div className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <Spinner />
                    </div>
                ) : data.length === 0 ? (
                    <div className="h-38 flex justify-center items-center text-sm text-stone-400">
                        No data found.
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-stone-50">
                            <TableRow>
                                <TableHead className="w-30">Plan Date</TableHead>
                                <TableHead className="w-25">Branch</TableHead>
                                <TableHead className="min-w-50">Activity Description</TableHead>
                                <TableHead>Before Note</TableHead>
                                <TableHead>After Note</TableHead>
                                <TableHead className="w-30 text-center">Status</TableHead>
                                <TableHead className="w-20 text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id} className="hover:bg-stone-50/80 transition-colors">

                                    <TableCell className="font-medium text-stone-700">
                                        {item.plan?.date ? formatDate(item.plan.date) : "-"}
                                        <span className="block text-[10px] text-stone-400 font-normal">{item.time || ""}</span>
                                    </TableCell>

                                    {/* Cabang */}
                                    <TableCell className="text-stone-600">
                                        {item.plan?.branch?.name || "-"}
                                        <span className="block text-[10px] text-stone-400">{item.plan?.branch?.area?.area || ""}</span>
                                    </TableCell>

                                    {/* Deskripsi Aktivitas */}
                                    <TableCell className="font-medium text-stone-900 max-w-70">
                                        <p className="line-clamp-2 leading-relaxed">{item.description || "-"}</p>
                                        <span className="text-[11px] font-normal text-stone-400 block mt-0.5">
                                            Assigned to: {item.plan?.user?.name || "-"}
                                        </span>
                                    </TableCell>

                                    {/* Progress Before */}
                                    <TableCell className="text-stone-600 text-xs max-w-37.5 truncate">
                                        {item.before_note || <span className="text-stone-300 italic">No note</span>}
                                    </TableCell>

                                    <TableCell className="text-stone-600 text-xs max-w-37.5 truncate">
                                        {item.after_note || <span className="text-stone-300 italic">No note</span>}
                                    </TableCell>


                                    <TableCell className="text-center">
                                        {getStatusBadge(item.status)}
                                    </TableCell>


                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <MyButton
                                                icon={IconExternalLink}
                                                iconOnly
                                                variant="white"
                                                onClick={() => handleNavigateToPlanDetail(item.id_plan)}
                                                title="View Main Plan Detail"
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-stone-200 shadow-sm">
                <p className="text-xs sm:text-sm text-stone-500 font-medium">
                    Page <span className="text-stone-800 font-bold">{page}</span> of <span className="text-stone-800 font-bold">{totalPages}</span>
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