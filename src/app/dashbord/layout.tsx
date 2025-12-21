import Breadcrumbs from "@/components/Breadcrumbs";
import DrawerContent from "@/components/Drawer/DrawerContent";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NavigationScroll from "@/components/NavigationScroll";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div>
      <DrawerContent />
      <Header />
      <div className="pc-container">
        <div className="pc-content">
          <Breadcrumbs />
          <NavigationScroll>
            {children}
          </NavigationScroll>
        </div>
      </div>
      <Footer />
    </div>
  );
}