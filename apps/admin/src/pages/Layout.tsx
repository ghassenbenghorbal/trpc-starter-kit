import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";

const Layout = () => {
    const defaultOpen = getCookie("sidebar:state");
    return (
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <SidebarProvider defaultOpen={defaultOpen == "true"}>
                    <AppSidebar />
                    <SidebarInset>
                        <AppHeader />
                        <Outlet/>
                    </SidebarInset>
                </SidebarProvider>
            <Toaster richColors closeButton />
        </ThemeProvider>
    );
};

const getCookie = (name: string) => {
    const cookieString = document.cookie; // e.g., "user=John; sessionId=abc123"
    const cookies = cookieString.split("; "); // Split into individual cookies
    for (const cookie of cookies) {
      const [key, value] = cookie.split("="); // Split into key-value pair
      if (key === name) {
        return decodeURIComponent(value); // Return decoded value if name matches
      }
    }
    return null; // Return null if cookie not found
};

export default Layout;
