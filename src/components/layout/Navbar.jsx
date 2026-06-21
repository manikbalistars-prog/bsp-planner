import { IconUser, IconLogout } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useLogout } from "@/hooks/useLogout";

export default function Navbar({ user }) {
  const { logout, loading } = useLogout()

  return (
    <div className="bg-stone-100 rounded-xl py-3 px-3 flex justify-between items-center">
      <span className="text-sm text-stone-500">{`${user?.role?.role || null} | ${user?.branch?.name || null}`} </span>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer select-none focus:outline-none hover:opacity-80 transition disabled:opacity-50" disabled={loading}>
          <p className="text-sm text-stone-900">
            Hi, {user?.username || "Guest"}
          </p>
          <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">
            <IconUser className="text-blue-500 w-5 h-5" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48 mt-1 bg-white">
          <DropdownMenuLabel className="text-xs text-stone-500 font-normal">
            Account Action
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={logout} // Eksekusi di sini
            disabled={loading}
            className="cursor-pointer focus:bg-blue-50 flex items-center gap-2"
          >
            <IconLogout className="w-4 h-4" />
            <span>{loading ? "Logging out..." : "Log Out"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}