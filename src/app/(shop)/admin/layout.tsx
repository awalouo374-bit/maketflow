import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  return (
    <>
      <style>{`
        .admin-layout { display: flex; min-height: calc(100vh - 68px); }
        .admin-main { flex: 1; background: #f8fafc; padding: 24px 16px; overflow-x: auto; }
        @media (min-width: 768px) { .admin-main { padding: 32px 32px; } }
        @media (min-width: 1024px) { .admin-main { padding: 36px 40px; } }
      `}</style>
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-main">
          {children}
        </main>
      </div>
    </>
  );
}
