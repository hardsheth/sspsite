export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard__content">
        <Header />
        <main className="dashboard__main">{children}</main>
      </div>
    </div>
  );
}