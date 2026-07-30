import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") redirect("/login");
  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      <AdminSidebar />
      <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
