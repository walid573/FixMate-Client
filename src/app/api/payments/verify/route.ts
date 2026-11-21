import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { signApiToken } from "@/lib/jwt";

// ---------------------------------------------------------------------------
// GET /api/payments/verify?session_id=...
//
// Protected route handler. Confirms the Stripe Checkout Session and lets
// the backend settle the payment — idempotently, so the same payment is
// never saved twice (page refresh, retries, or a future webhook).
//
// Server-side, so the backend JWT is signed directly from the session.
// ---------------------------------------------------------------------------
export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;

  if (!email || !session?.user?.id) {
    return Response.json(
      { error: "Please sign in to verify your payment." },
      { status: 401 }
    );
  }

  const sessionId = new URL(request.url).searchParams.get("session_id");

  if (!sessionId) {
    return Response.json({ error: "session_id is required." }, { status: 400 });
  }

  const token = signApiToken({
    sub: session.user.id,
    email,
    role: (session.user as { role?: string }).role,
    name: session.user.name,
  });

  const res = await fetch(`${process.env.BASE_URL}/payments/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ sessionId, customerEmail: email }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return Response.json(
      {
        error:
          (data as { message?: string }).message || "Could not verify payment.",
      },
      { status: res.status }
    );
  }

  return Response.json(data);
}