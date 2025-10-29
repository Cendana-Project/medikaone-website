import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <AppSidebar />
                <main className="flex-1 flex flex-col items-center justify-center p-6">
                    <div className="self-start mb-4">
                        <SidebarTrigger />
                    </div>

                    <div className="w-full max-w-4xl">{children}</div>
                </main>
            </div>
        </SidebarProvider>
    )
}