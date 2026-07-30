import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSessionUser } from "@/lib/session";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  const isAdmin = user?.role === "ADMIN";
  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && <Navbar role={user?.role} userName={user?.name} />}
      <div className="flex-1">{children}</div>
      {!isAdmin && <Footer />}
    </div>
  );
}
