import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { mongoClient } from "@/lib/mongo";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    // Get the session to verify the user is authenticated
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Read the signup_role cookie
    const cookieHeader = request.headers.get("cookie");
    const roleMatch = cookieHeader?.match(/signup_role=([^;]+)/);
    const role = roleMatch?.[1];

    // Only allow updating to customer or technician (not admin)
    if (!role || !["customer", "technician"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid or missing role" },
        { status: 400 }
      );
    }

    // Reuse the single pooled client — opening a fresh connection on every
    // request quickly exhausts the Atlas connection limit.
    const users = mongoClient.db("fixmate").collection("users");

    // Better-auth stores user IDs as strings, but MongoDB might use ObjectId
    let userId = session.user.id;
    let query: any = { _id: userId };

    // Try ObjectId first if it's a valid ObjectId string
    if (ObjectId.isValid(userId)) {
      query = { _id: new ObjectId(userId) };
    }

    const result = await users.updateOne(
      query,
      {
        $set: {
          role: role,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Clear the cookie after successful update
    const response = NextResponse.json({
      success: true,
      role: role,
      message: `Role updated to ${role}`,
    });

    response.cookies.set("signup_role", "", {
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Update role error:", error);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}
