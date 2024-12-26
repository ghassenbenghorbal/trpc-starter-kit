import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <NuqsAdapter>
                <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                        <AppHeader />
                        {children}
                    </SidebarInset>
                </SidebarProvider>
            </NuqsAdapter>
        </ThemeProvider>
    );
}
