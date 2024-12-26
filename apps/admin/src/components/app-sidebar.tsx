"use client";

import * as React from "react";
import { AudioWaveform, Command, GalleryVerticalEnd, LayoutDashboard, Settings, Inbox, Send } from "lucide-react";

import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";

// This is sample data.
const data = {
    user: {
        name: "Lazhar",
        email: "lazhar@autretunisie.com",
        avatar: "/avatars/shadcn.jpg",
    },
    // teams: [
    //   {
    //     name: "Acme Inc",
    //     logo: GalleryVerticalEnd,
    //     plan: "Enterprise",
    //   },
    //   {
    //     name: "Acme Corp.",
    //     logo: AudioWaveform,
    //     plan: "Startup",
    //   },
    //   {
    //     name: "Evil Corp.",
    //     logo: Command,
    //     plan: "Free",
    //   },
    // ],
    workspaces: [
        {
            name: "Finance Workspace",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "IT Workspace",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "HR Workspace",
            logo: Command,
            plan: "Free",
        },
    ],
    navItems: [
        {
            name: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Inbox",
            url: "/inbox",
            icon: Inbox,
        },
        {
            name: "Requests",
            url: "/requests",
            icon: Send,
        },
        {
            name: "Settings",
            url: "/settings",
            icon: Settings,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
              <NavUser user={data.user} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navItems} />
            </SidebarContent>
            {/* <SidebarRail /> */}
        </Sidebar>
    );
}
