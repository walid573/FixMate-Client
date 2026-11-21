"use client";

// ---------------------------------------------------------------------------
// useUpdateUserRole
//
// A reusable hook for updating a user's role via PATCH /users/:id/role.
// Returns [updateRole, loading] so any component can call updateRole(id, role).
//
// This is a CLIENT hook (it uses useState / useRouter), so it must not import
// server code directly. The request goes through the updateUserRole server
// action, which attaches the auth token on the server.
// ---------------------------------------------------------------------------
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/toast";
import { updateUserRole, UserRole } from "@/lib/actions/user";

export function useUpdateUserRole() {
  const [loading, setLoading] = useState(false);
  const pushToast = useToast();
  const router = useRouter();

  async function updateRole(userId: string, role: UserRole) {
    setLoading(true);
    try {
      const result = await updateUserRole(userId, role);

      if (!result.ok) {
        pushToast(result.message, "error");
        return;
      }

      pushToast(`Role updated to ${role}.`, "success");
      router.refresh();
    } catch {
      pushToast("Failed to update role.", "error");
    } finally {
      setLoading(false);
    }
  }

  return [updateRole, loading] as const;
}