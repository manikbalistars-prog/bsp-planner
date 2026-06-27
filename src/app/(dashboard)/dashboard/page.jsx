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

import { Spinner } from "@/components/ui/spinner";

import { toast } from "sonner";

export default function Dashboard() {
    const now = new Date();

    const [month, setMonth] = useState(String(now.getMonth() + 1));
    const [year, setYear] = useState(String(now.getFullYear()));

    const [branchData, setBranchData] = useState([]);
    const [areaData, setAreaData] = useState([]);
    const [loading, setLoading] = useState(false);

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
                const sorted = [...branchJson.data].sort(
                    (a, b) => b.branch_points - a.branch_points
                );

                setBranchData(sorted);
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
                return "bg-blue-500/10";

            case "TIMUR":
                return "bg-green-500/10";

            case "CENTRAL":
                return "bg-orange-500/10";

            default:
                return "bg-purple-500/10";
        }
    };

    return (
        <div className="space-y-6 rounded-lg bg-white p-6">

            {/* Header */}
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

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
                            <div className="text-sm font-medium text-muted-foreground">
                                {area.area_name}
                            </div>

                            <div className="mt-3 text-4xl font-bold">
                                {area.total_progress}
                            </div>

                            <div className="mt-2 text-sm text-muted-foreground">
                                Progress
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Branch Table */}

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
                                Point
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
                                        {item.branch_points}
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