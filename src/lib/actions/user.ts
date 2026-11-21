
"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export type UserRole = "customer" | "technician" | "admin";

interface UpdateUserRoleResult {
  ok: boolean;
  message: string;
}

const jwtResult = await auth.api.getToken({
  headers: await headers(),
});

const token = jwtResult.token;
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

    // Get authenticated session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        ok: false,
        message: "Unauthorized. Please login again.",
      };
    }

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
