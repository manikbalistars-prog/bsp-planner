"use client";

import { useState } from "react";

export default function UserPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    id_branch: "",
    isAdmin: false,
    isOwner: false,
  });

  const save = async () => {
    const res = await fetch(
      "/api/users",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    const result =
      await res.json();

    if (result.success) {
      alert("User berhasil dibuat");
    }
  };

  return (
    <div>
      <input
        placeholder="Username"
        onChange={(e) =>
          setForm({
            ...form,
            username: e.target.value,
          })
        }
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setForm({
            ...form,
            password: e.target.value,
          })
        }
      />

      <input
        placeholder="Nama"
        onChange={(e) =>
          setForm({
            ...form,
            name: e.target.value,
          })
        }
      />

      <label>
        <input
          type="checkbox"
          onChange={(e) =>
            setForm({
              ...form,
              isAdmin: e.target.checked,
            })
          }
        />
        Admin
      </label>

      <label>
        <input
          type="checkbox"
          onChange={(e) =>
            setForm({
              ...form,
              isOwner: e.target.checked,
            })
          }
        />
        Owner
      </label>

      <button onClick={save}>
        Simpan
      </button>
    </div>
  );
}