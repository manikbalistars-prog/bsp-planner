import { useState } from "react";
import { toast } from "sonner";

export function useChangePassword() {
  const [loading, setLoading] = useState(false);

  const changePassword = async (password) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch("/api/profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      toast.success("Password updated successfully");
      return true;
    } catch (err) {
      toast.error(err.message || "Failed to update password");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    changePassword,
    loading,
  };
}