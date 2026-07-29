import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">{children}</main>
    </div>
  );
}
