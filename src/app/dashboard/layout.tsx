import { AppSidebar } from "@/components/dashboard-sidebar/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
     <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="min-w-0 flex-1">
        <header className="flex h-14 items-center border-b px-4">
          <SidebarTrigger />
        </header>

        <main className="w-full min-w-0 flex-1 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}