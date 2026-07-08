'use client'

import { useMemo, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { formatDate } from "@/lib/utils"

const demoPlans = [
    {
        id: 1,
        title: "Audit Display Promo Mingguan",
        date: "2026-07-09",
        branch: { name: "BSP Cihampelas" },
        user: { name: "Rina P" },
        totalItem: 10,
        completedItem: 7,
    },
    {
        id: 2,
        title: "Monitoring Stock Fast Moving",
        date: "2026-07-10",
        branch: { name: "BSP Sukajadi" },
        user: { name: "Dimas R" },
        totalItem: 14,
        completedItem: 9,
    },
    {
        id: 3,
        title: "Cek Material POSM Area Kasir",
        date: "2026-07-12",
        branch: { name: "BSP Kopo" },
        user: { name: "Yusuf H" },
        totalItem: 8,
        completedItem: 8,
    },
    {
        id: 4,
        title: "Evaluasi Planogram Minuman",
        date: "2026-07-15",
        branch: { name: "BSP Buah Batu" },
        user: { name: "Salsa N" },
        totalItem: 12,
        completedItem: 5,
    },
    {
        id: 5,
        title: "Pengecekan Kerapian Gondola",
        date: "2026-07-16",
        branch: { name: "BSP Antapani" },
        user: { name: "Fikri A" },
        totalItem: 11,
        completedItem: 3,
    },
    {
        id: 6,
        title: "Validasi Harga Shelf & POS",
        date: "2026-07-18",
        branch: { name: "BSP Setiabudi" },
        user: { name: "Lala M" },
        totalItem: 7,
        completedItem: 4,
    },
]

export default function Plans() {
    const [selectedDate, setSelectedDate] = useState(new Date(demoPlans[0]?.date ?? new Date()))

    const planDateMap = useMemo(() => {
        return demoPlans.reduce((acc, item) => {
            const key = item.date
            if (!acc[key]) {
                acc[key] = []
            }
            acc[key].push(item)
            return acc
        }, {})
    }, [])

    const selectedDateKey = selectedDate ? selectedDate.toISOString().split("T")[0] : ""
    const plansOnSelectedDate = selectedDateKey ? planDateMap[selectedDateKey] || [] : []

    const planDates = useMemo(() => {
        return Object.keys(planDateMap).map((date) => new Date(date))
    }, [])

    return (
        <div className="space-y-3 pb-2">
            <div className="relative left-1/2 w-screen -translate-x-1/2 rounded-2xl border border-stone-200 bg-white p-2 sm:p-4">
                <div className="mb-4">
                    <p className="text-xs font-semibold tracking-wide text-stone-500">PLAN CALENDAR</p>
                    <h1 className="text-xl font-bold text-stone-800">Jadwal Plan</h1>
                    <p className="text-sm text-stone-500">Klik tanggal untuk melihat plan yang tersedia.</p>
                </div>

                <div className="rounded-2xl border border-stone-100 bg-gradient-to-b from-stone-50 to-white p-1 sm:p-2">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                            if (date) {
                                setSelectedDate(date)
                            }
                        }}
                        modifiers={{
                            hasPlan: planDates,
                        }}
                        modifiersClassNames={{
                            hasPlan: "bg-orange-100 text-orange-700 font-semibold rounded-md",
                        }}
                        className="w-full rounded-xl [--cell-size:clamp(1.9rem,11vw,2.9rem)]"
                        classNames={{
                            root: "w-full",
                            month: "w-full",
                            month_grid: "w-full",
                            weekdays: "grid grid-cols-7",
                            week: "grid grid-cols-7 mt-2",
                        }}
                    />
                </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
                <p className="text-sm font-semibold text-stone-700">
                    Plan di {selectedDate ? formatDate(selectedDate, true) : "-"}
                </p>

                {plansOnSelectedDate.length === 0 ? (
                    <p className="mt-3 text-sm text-stone-500">Tidak ada plan pada tanggal ini.</p>
                ) : (
                    <div className="mt-3 space-y-2.5">
                        {plansOnSelectedDate.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-3"
                            >
                                <p className="text-sm font-semibold text-stone-800">{item.title}</p>
                                <div className="mt-1 grid grid-cols-1 gap-1 text-xs text-stone-600 sm:grid-cols-3">
                                    <p>Cabang: {item.branch?.name || "-"}</p>
                                    <p>PIC: {item.user?.name || "-"}</p>
                                    <p>Task: {item.completedItem || 0}/{item.totalItem || 0}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}