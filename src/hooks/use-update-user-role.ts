// ---------------------------------------------------------------------------
// useUpdateUserRole
//
// A reusable hook for updating a user's role via PATCH /users/:id/role.
// Returns [updateRole, loading] so any component can call updateRole(id, role).
// ---------------------------------------------------------------------------
import { useState } from "react";
import { useToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

export function useUpdateUserRole() {
  const [loading, setLoading] = useState(false);
  const pushToast = useToast();
  const router = useRouter()
  async function updateRole(userId: string, role: string) {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}/role`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { message?: string }).message || "Failed to update role."
        );
      }

      pushToast(`Role updated to ${role}.`, "success");
      router.refresh()
    } catch (err) {
      pushToast(
        err instanceof Error ? err.message : "Failed to update role.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  return [updateRole, loading] as const;
}