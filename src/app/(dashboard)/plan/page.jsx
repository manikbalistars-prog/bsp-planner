"use client";

import { useMemo, useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { MyButton } from "@/components/ui/MyButton";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

import Link from "next/link";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

export default function Plan() {
  const { currentUser } = useAuth();

  const parseDate = (dateString) => {
    const [y, m, d] = dateString.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const router = useRouter();

  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    if (currentUser?.role?.role === "kepala cabang") return;

    const loadUsers = async () => {
      try {
        const res = await fetch("/api/user?all=true");
        const json = await res.json();
        if (json.success) {
          setUsers(json.users || []);
        }
      } catch (err) {
        toast.error("Failed to load users", {
          description: err.message,
        });
      }
    };

    loadUsers();
  }, [currentUser]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getPlans(
        currentMonth.getMonth() + 1,
        currentMonth.getFullYear(),
        selectedUser,
      );
    }, 300);

    return () => clearTimeout(timeout);
  }, [currentMonth, selectedUser]);

  useEffect(() => {
    if (plans.length > 0) {
      setSelectedDate(parseDate(plans[0].date));
    } else {
      setSelectedDate(undefined);
    }
  }, [plans]);

  const getPlans = async (month, year, userId) => {
    try {
      setLoadingPlans(true);

      const params = new URLSearchParams({
        month: String(month),
        year: String(year),
      });

      if (userId) {
        params.append("id_user", userId);
      }

      const res = await fetch(`/api/plan?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setPlans(json.data);
      } else {
        setPlans([]);
      }
    } catch (err) {
      toast.error("Failed to fetch data", {
        description: err.message,
      });
    } finally {
      setLoadingPlans(false);
    }
  };

  const planDateMap = useMemo(() => {
    return plans.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = [];
      }

      acc[item.date].push(item);

      return acc;
    }, {});
  }, [plans]);

  const selectedDateKey = selectedDate
    ? new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000,
      )
        .toISOString()
        .split("T")[0]
    : "";
  const plansOnSelectedDate = planDateMap[selectedDateKey] || [];

  const planDates = useMemo(() => {
    return Object.keys(planDateMap).map((date) => {
      const [y, m, d] = date.split("-").map(Number);
      return new Date(y, m - 1, d);
    });
  }, [planDateMap]);

  const handleNavigateToDetail = (item) => {
    router.push(`/plan/detail?id=${item.id}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 relative">
      <div className="sticky top-14 self-start">
        <div className="rounded-2xl border border-stone-200 bg-white p-2">
          <div className="mb-2 p-2 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-stone-800">Plans</h1>
              <p className="text-sm text-stone-500">
                Klik tanggal untuk melihat plan yang tersedia.
              </p>
            </div>
            {currentUser.role?.role == "kepala cabang" && (
              <Link href="/plan/create" className="shrink-0">
                <MyButton label="Create Plan" variant="success"></MyButton>
              </Link>
            )}
          </div>

          {currentUser.role?.role != "kepala cabang" && (
            <div className="flex flex-col gap-2 text-sm text-stone-500">
              <span>filter by user</span>
              <Combobox
                items={users}
                value={selectedUser}
                onValueChange={(value) => {
                  setSelectedUser(value);
                }}>
                <ComboboxInput
                  placeholder="Select a user"
                  className="bg-white"
                  value={
                    users.find((u) => String(u.id) === selectedUser)?.name || ""
                  }
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

          {selectedUser && (
            <div className="py-2">
              <MyButton
                label="clear filter"
                variant="netral"
                onClick={() => {
                  setSelectedUser("");
                }}
              />
            </div>
          )}

          <div className="rounded-2xl border border-stone-100">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                }
              }}
              modifiers={{
                hasPlan: planDates,
              }}
              onMonthChange={(month) => {
                setCurrentMonth(month);
              }}
              modifiersClassNames={{
                hasPlan:
                  "bg-orange-100 text-orange-700 font-semibold rounded-md",
              }}
              classNames={{
                root: "w-full",
                month: "w-full",
                month_grid: "w-full",
                weekdays: "grid grid-cols-7 gap-1",
                week: "grid grid-cols-7 gap-1 mt-2",
              }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 z-20">
        <div className="flex justify-between">
          <p className="text-sm font-semibold text-stone-700">
            Plan {selectedDate ? formatDate(selectedDate, true) : "-"}
          </p>
        </div>

        {loadingPlans ? (
          <div className="flex justify-center items-center h-72">
            <Spinner />
          </div>
        ) : plansOnSelectedDate.length === 0 ? (
          <p className="mt-3 text-sm text-stone-500">
            Tidak ada plan pada tanggal ini.
          </p>
        ) : (
          <div className="mt-3 space-y-2.5">
            {plansOnSelectedDate.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNavigateToDetail(item)}
                className="bg-white p-3.5 rounded-sm  border border-stone-600  active:bg-stone-50 cursor-pointer flex flex-col gap-2 hover:bg-blue-50">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-semibold text-stone-900 text-sm line-clamp-2 leading-snug">
                    {item.title}
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full shrink-0">
                    -
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-xs pt-2 mt-1 border-t border-stone-100">
                  <div>
                    <span className="block text-[10px] text-stone-400 font-medium tracking-wide">
                      PLAN DATE
                    </span>
                    <span className="font-medium text-stone-700">
                      {formatDate(item.date)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-stone-400 font-medium tracking-wide">
                      BRANCH
                    </span>
                    <span className="font-medium text-stone-700">
                      {item.branch?.name || "-"}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] text-stone-400 font-medium tracking-wide">
                      ASSIGNED TO
                    </span>
                    <span className="font-medium text-stone-700">
                      {item.user?.name || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-stone-400 font-medium tracking-wide">
                      Task
                    </span>
                    <span className="font-medium text-stone-700">
                      {item.totalItem || 0}/{item.completedItem || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
