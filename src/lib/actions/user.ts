
"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export type UserRole = "customer" | "technician" | "admin";

interface UpdateUserRoleResult {
  ok: boolean;
  message: string;
}

export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<UpdateUserRoleResult> {
  try {
    if (!userId || !role) {
      return {
        ok: false,
        message: "User ID and role are required.",
      };
    }

    // Must run per request: `headers()` is only valid inside a request scope,
    // and a token cached at module load would expire after 15 minutes.
    const requestHeaders = await headers();

    // Get authenticated session
    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    if (!session) {
      return {
        ok: false,
        message: "Unauthorized. Please login again.",
      };
    }

    const { token } = await auth.api.getToken({ headers: requestHeaders });

    // Call Express backend
    const response = await fetch(
      `${process.env.BASE_URL}/users/${userId}/role`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        message: data.message || "Failed to update user role.",
      };
    }

    return {
      ok: true,
      message: data.message || "User role updated successfully.",
    };
  } catch (error) {
    console.error("Update user role error:", error);

    return {
      ok: false,
      message: "Something went wrong while updating user role.",
    };
  }
}
