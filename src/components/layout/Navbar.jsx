"use client";

import { useState } from "react";

import { IconUser, IconLogout, IconLock } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { useChangePassword } from "@/hooks/useChangePass";


import { MyButton } from "../ui/MyButton";
import InputForm from "../ui/InputForm";

import { useLogout } from "@/hooks/useLogout";

export default function Navbar({ user, isDemo }) {
  const { logout, loading } = useLogout()
  const [open, setOpen] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { changePassword, loading: changePasswordLoading } = useChangePassword();

  const handleOpenChange = (value) => {
    setOpen(value);

    if (!value) {
      setPassword("");
      setConfirmPassword("");
    }
  };

  const handleSave = async () => {
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password and confirmation password do not match.");
      return;
    }

    const success = await changePassword(password);

    if (!success) return;

    toast.success("Password updated successfully.");

    setPassword("");
    setConfirmPassword("");
    setOpen(false);
  };

  return (
    <>
      <div className="py-3 px-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-stone-500">
            {`${user?.role?.role || ""} | ${user?.branch?.name || user?.area?.area || ""}`}
          </span>

          {isDemo && (
            <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-white">
              DEMO
            </span>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer select-none focus:outline-none hover:opacity-80 transition disabled:opacity-50" disabled={loading}>
            <p className="text-sm text-stone-900 text-end">
              Hi, {user?.name || "Guest"}
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
              onClick={() => setOpen(true)}
              className="cursor-pointer"
            >
              <IconLock className="w-4 h-4" />
              Change Password
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={logout}
              disabled={loading}
              className="cursor-pointer focus:bg-blue-50 flex items-center gap-2"
            >
              <IconLogout className="w-4 h-4" />
              <span>{loading ? "Logging out..." : "Log Out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your new password below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <InputForm
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <InputForm
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <DialogFooter>
            <MyButton
              id={"cancel-change-password"}
             variant={changePasswordLoading? "disable": "warning"}
              onClick={() => setOpen(false)}
              label={"cancel"}
            >
              Cancel
            </MyButton>

            <MyButton
              id="submit-change-password"
              onClick={handleSave}
              
              variant={changePasswordLoading? "disable": "success"}
              disabled={changePasswordLoading}
              label={changePasswordLoading ? "Saving..." : "Save"}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}