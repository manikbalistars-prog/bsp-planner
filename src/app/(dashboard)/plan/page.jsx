'use client'
import { MyButton } from "@/components/ui/MyButton"
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { useState, useEffect } from "react"
import { formatDate } from "@/lib/utils"

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

import { useRouter } from "next/navigation"


export default function Plan() {
    const { curentUser } = useAuth()

    const router = useRouter()

    const [page, setPage] = useState(1);

    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalData, setTotalData] = useState(0)
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [data, setData] = useState([])

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/plan?page=${page}&limit=${limit}&search=${debouncedSearch}`);
            const data = await res.json()

            if (data.success) {
                setData(data.data)
                setTotalPages(data.totalPages)
                setTotalData(data.totalData)
            }

        } catch (error) {
            toast.error("failed to fetching data", {
                description: err.message || "Something went wrong"
            })

        } finally {
            setLoading(false);
        }
    }


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
        loadData()
    }, [page, debouncedSearch, limit]);


    const handleNavigateToDetail = (item) => {
        const short = {
            id: item.id,
            t: item.title,
            d: item.date,
            u: item.user?.name,
            iu:item.user?.id,
            b: item.branch?.name,
            a: item.branch?.area?.area
        }
        const encodedData = encodeURIComponent(JSON.stringify(short));
        router.push(`/plan/detail?data=${encodedData}`);
    }
    return (
        <div className="flex flex-col gap-2">
            <div className="bg-white p-3 rounded-lg  flex flex-col justify-between ">
                <div className="flex justify-between">
                    <p className="font-semibold text-stone-600">All Plans</p>
                    <Link href="/plan/create"><MyButton label="Create Plan" variant="success"></MyButton></Link>
                </div>

                <div className="flex justify-between items-end">
                    <div className="flex gap-2 flex-wrap">
                        <div className="flex flex-col gap-2 text-sm text-stone-500 shrink-0">
                            <span>Search</span>
                            <input
                                type="text"
                                placeholder="Search users by title..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full sm:w-64 px-3 text-stone-400 py-1.5 text-sm rounded-md border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-stone-500/20 focus:border-stone-500"
                            />
                        </div>

                        <div className="flex flex-col gap-2 text-sm text-stone-500 shrink-0">
                            <span>Show</span>
                            <select
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="px-2 py-1.5 text-stone-900 bg-white border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500/20"
                            >
                                <option value={5}>5 </option>
                                <option value={10}>10 </option>
                                <option value={25}>25 </option>
                                <option value={50}>50 </option>
                            </select>
                        </div>
                    </div>
                    <div className="text-xs text-stone-400">Total Plans : <span className="text-stone-900">{totalData}</span> </div>
                </div>
            </div>

            <div className="block space-y-2">
                {loading ? (
                    <div className="flex justify-center items-center h-32 bg-white rounded-lg border border-stone-100">
                        <Spinner />
                    </div>
                ) : data.length === 0 ? (
                    <div className="h-32 flex justify-center items-center text-sm text-stone-400 bg-white rounded-lg border border-stone-100">
                        No data found.
                    </div>
                ) : (
                    data.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleNavigateToDetail(item)}
                            className="bg-white p-3.5 rounded-sm active:bg-stone-50 cursor-pointer flex flex-col gap-2 hover:bg-blue-50"
                        >
                            <div className="flex justify-between items-start gap-2">
                                <span className="font-semibold text-stone-900 text-sm line-clamp-2 leading-snug">
                                    {item.title}
                                </span>
                                <span className="text-[11px] font-medium px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full shrink-0">-</span>
                            </div>

                            <div className="grid grid-cols-2 gap-y-2 text-xs pt-2 mt-1 border-t border-stone-100">
                                <div>
                                    <span className="block text-[10px] text-stone-400 font-medium tracking-wide">PLAN DATE</span>
                                    <span className="font-medium text-stone-700">{formatDate(item.date)}</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] text-stone-400 font-medium tracking-wide">BRANCH</span>
                                    <span className="font-medium text-stone-700">{item.branch?.name || "-"}</span>
                                </div>

                                <div>
                                    <span className="block text-[10px] text-stone-400 font-medium tracking-wide">ASSIGNED TO</span>
                                    <span className="font-medium text-stone-700">{item.user?.name || "-"}</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] text-stone-400 font-medium tracking-wide">Task</span>
                                    <span className="font-medium text-stone-700">0/0</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="">
                <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-stone-100">
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
        </div>
    )
}