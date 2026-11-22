import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// ---------------------------------------------------------------------------
// POST /api/payments/create-checkout-session
//
// Protected route handler: the booking is resolved server-side and must
// belong to the LOGGED-IN user — the client only ever sends a bookingId.
// Forwards to the Express backend, which creates the Stripe Checkout
// Session with the amount stored on the booking document (never an amount
// sent from the browser).
//
// This runs on the server, so it takes the backend JWT straight from
// better-auth's token endpoint instead of calling it over HTTP.
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  const email = session?.user?.email;

  if (!email || !session?.user?.id) {
    return Response.json({ error: "Please sign in to pay." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const bookingId = typeof body.bookingId === "string" ? body.bookingId : "";

  if (!bookingId) {
    return Response.json({ error: "bookingId is required." }, { status: 400 });
  }

  const { token } = await auth.api.getToken({ headers: requestHeaders });

  const res = await fetch(`${process.env.BASE_URL}/payments/create-checkout-session`, {
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