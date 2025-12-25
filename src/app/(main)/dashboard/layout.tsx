import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F9FC] pt-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex gap-8 py-8">
           <DashboardSidebar />
           <main className="flex-1 min-w-0">
             {children}
           </main>
        </div>
      </div>
    </div>
  );
}
