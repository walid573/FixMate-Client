import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { signApiToken } from "@/lib/jwt";

// ---------------------------------------------------------------------------
// POST /api/payments/create-checkout-session
//
// Protected route handler: the booking is resolved server-side and must
// belong to the LOGGED-IN user — the client only ever sends a bookingId.
// Forwards to the Express backend, which creates the Stripe Checkout
// Session with the amount stored on the booking document (never an amount
// sent from the browser).
//
// This runs on the server, so instead of calling /api/token it signs the
// backend JWT directly from the session we already resolved above.
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;

  if (!email || !session?.user?.id) {
    return Response.json({ error: "Please sign in to pay." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const bookingId = typeof body.bookingId === "string" ? body.bookingId : "";

  if (!bookingId) {
    return Response.json({ error: "bookingId is required." }, { status: 400 });
  }

  const token = signApiToken({
    sub: session.user.id,
    email,
    role: (session.user as { role?: string }).role,
    name: session.user.name,
  });

  const res = await fetch(`${process.env.BASE_URL}/payments/checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bookingId, customerEmail: email }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    url?: string;
    message?: string;
  };

  if (!res.ok || !data.url) {
    return Response.json(
      { error: data.message || "Could not start checkout." },
      { status: res.status || 500 }
    );
  }

  return Response.json({ url: data.url });
}