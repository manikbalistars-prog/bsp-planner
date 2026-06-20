"use client";

import InputForm from "../ui/InputForm";
import Button from "../ui/Button";
import Link from "next/link";
import { useState } from "react";
import { useLogin } from "@/hooks/useLogin";
import { toast } from "sonner";

export default function LoginForm() {
  const { login, loading } = useLogin();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(form);
      toast.success("Login successful! Redirecting...");
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
    }
  };

  return (
    <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
      <InputForm
        label="Username"
        name="username"
        type="text"
        placeholder="Input username here!"
        value={form.username}
        onChange={handleChange}
        required
      />

      <InputForm
        label="Password"
        name="password"
        type="password"
        placeholder="Input password here!"
        value={form.password}
        onChange={handleChange}
        required
      />

      <Button
        label={loading ? "Loading..." : "Login"}
        id="login"
        variant="primary"
        type="submit"
        disabled={loading} // Bagus untuk mencegah double-submit saat loading
      />

      <div className="pt-2 w-full flex justify-center">
        <Link
          className="text-sm text-center text-stone-600"
          href="https://wa.me/6287848905327?text=hi,%20i%20need%20BSP%20planner%20account"
          target="_blank"
        >
          Don't Have An Account?
        </Link>
      </div>
    </form>
  );
}