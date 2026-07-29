import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSessionUser } from "@/lib/session";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar role={user?.role} userName={user?.name} />
      <div style={{ flex: 1 }}>
        {children}
      </div>
      <Footer />
    </div>
  );
}
