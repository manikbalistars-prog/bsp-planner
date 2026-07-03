"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    IconChecklist,
    IconClockHour4,
    IconClipboardList,
} from "@tabler/icons-react";

import { Spinner } from "@/components/ui/spinner";

import { toast } from "sonner";

export default function Dashboard() {
    const now = new Date();

    const [month, setMonth] = useState(String(now.getMonth() + 1));
    const [year, setYear] = useState(String(now.getFullYear()));

    const [branchData, setBranchData] = useState([]);
    const [areaData, setAreaData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [efectiveDay, setEfectiveDay] = useState(0)

    useEffect(() => {
        getDashboard();
    }, []);

    async function getDashboard() {
        try {
            setLoading(true);

            const [branchRes, areaRes] = await Promise.all([
                fetch(`/api/dashboard/branch?month=${month}&year=${year}`),
                fetch(`/api/dashboard/area?month=${month}&year=${year}`),
            ]);

            const branchJson = await branchRes.json();
            const areaJson = await areaRes.json();

            if (branchJson.success) {
                const branches = Array.isArray(branchJson.data)
                    ? branchJson.data
                    : [];

                const sorted = branches.sort(
                    (a, b) => b.branch_score - a.branch_score
                );

                setBranchData(sorted);
                setEfectiveDay(branchJson.efective_day)
            } else {
                setBranchData([]);
            }

            if (areaJson.success) {
                setAreaData(areaJson.data);
            } else {
                setAreaData([]);
            }
        } catch (err) {
            toast.error("failed to fetching data", {
                description: err.message || "Something went wrong"
            })
        } finally {
            setLoading(false);
        }
    }

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const years = [];

    for (let y = now.getFullYear(); y >= 2024; y--) {
        years.push(y);
    }

    const medal = (index) => {
        switch (index) {
            case 0:
                return "🥇";
            case 1:
                return "🥈";
            case 2:
                return "🥉";
            default:
                return index + 1;
        }
    };

    const areaColor = (area) => {
        switch (area) {
            case "BARAT":
                return "bg-blue-100 text-blue-700";
            case "TIMUR":
                return "bg-green-100 text-green-700";
            case "CENTRAL":
                return "bg-orange-100 text-orange-700";
            default:
                return "bg-purple-100 text-purple-700";
        }
    };

    const cardColor = (area) => {
        switch (area) {
            case "BARAT":
                return "bg-blue-300/10";

            case "TIMUR":
                return "bg-green-300/10";

            case "CENTRAL":
                return "bg-orange-300/10";

            default:
                return "bg-purple-300/10";
        }
    };

    return (
        <div className="space-y-6 rounded-lg bg-white p-6">


            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                    <h1 className="text-2xl font-bold">
                        Dashboard
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Branch Point Ranking
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">

                    <Select value={month} onValueChange={setMonth}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            {months.map((month, index) => (
                                <SelectItem
                                    key={index}
                                    value={String(index + 1)}
                                >
                                    {month}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={year} onValueChange={setYear}>
                        <SelectTrigger className="w-28">
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem
                                    key={year}
                                    value={String(year)}
                                >
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        onClick={getDashboard}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Filter"}
                    </Button>

                </div>

            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">

                {loading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-28 animate-pulse rounded-xl border bg-gray-100"
                        />
                    ))
                ) : (
                    areaData.map((area) => (
                        <div
                            key={area.id_area}
                            className={`rounded-xl p-5 shadow-sm transition hover:shadow-md ${cardColor(
                                area.area_name
                            )}`}
                        >
                            <h3 className="text-sm font-semibold text-muted-foreground">
                                {area.area_name}
                            </h3>

                            <div className="mt-5 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <IconChecklist size={18} className="" />
                                        <span className="text-sm">Checked</span>
                                    </div>

                                    <span className="text-lg font-bold">
                                        {area.total_progress}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <IconClockHour4 size={18} className="" />
                                        <span className="text-sm">Need Check</span>
                                    </div>

                                    <span className="text-lg font-bold">
                                        {area.need_check}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <IconClipboardList size={18} />
                                        <span className="text-sm">Total Items</span>
                                    </div>

                                    <span className="text-lg font-bold">
                                        {area.total_task}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-5 h-2 rounded-full bg-muted overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-stone-600 transition-all"
                                    style={{
                                        width: `${area.need_check === 0
                                                ? 0
                                                : (area.total_progress / area.need_check) * 100
                                            }%`,
                                    }}
                                />
                            </div>

                            <p className="mt-2 text-xs text-muted-foreground">
                                {area.need_check === 0
                                    ? "Belum ada item yang siap dicek"
                                    : `${Math.round(
                                        (area.total_progress / area.need_check) * 100
                                    )}% selesai diperiksa`}
                            </p>
                        </div>
                    ))
                )}
            </div>


            <div>Efective day : <span>{efectiveDay}</span></div>
            <div className="rounded-lg border overflow-hidden">


                <Table>

                    <TableHeader>

                        <TableRow>
                            <TableHead className="w-20 text-center">
                                Rank
                            </TableHead>

                            <TableHead>
                                Branch
                            </TableHead>

                            <TableHead>
                                Area
                            </TableHead>

                            <TableHead>
                                PIC
                            </TableHead>

                            <TableHead className="text-right">
                                Score
                            </TableHead>
                        </TableRow>

                    </TableHeader>

                    <TableBody>

                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center align-middle">
                                    <Spinner className="mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : branchData.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-24 text-center"
                                >
                                    No data available
                                </TableCell>
                            </TableRow>
                        ) : (
                            branchData.map((item, index) => (
                                <TableRow key={item.id_branch}>

                                    <TableCell className="text-center text-lg ">
                                        {medal(index)}
                                    </TableCell>

                                    <TableCell className="font-semibold">
                                        {item.branch_name}
                                    </TableCell>

                                    <TableCell>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${areaColor(
                                                item.branch_area
                                            )}`}
                                        >
                                            {item.branch_area}
                                        </span>

                                    </TableCell>

                                    <TableCell>
                                        {item.user_name ?? "-"}
                                    </TableCell>

                                    <TableCell className="text-right font-bold">
                                        {item.branch_score}
                                    </TableCell>

                                </TableRow>
                            ))
                        )}

                    </TableBody>

                </Table>

            </div>

        </div>
    );
}