import { redirect } from "next/navigation";

// Legacy role-specific profile route — the shared /dashboard/profile now
// serves every role. Redirect keeps old bookmarks and sidebar links working.
export default function AdminProfilePage() {
  redirect("/dashboard/profile");
}
