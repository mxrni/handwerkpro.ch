import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  Calendar,
  ClipboardList,
  FileText,
  HelpCircle,
  LayoutDashboard,
  MessageCircle,
  PieChart,
  TimerIcon,
  ToolCase,
  UserCog,
  Users,
} from "lucide-react";
import { NavMeine } from "./nav-documents";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";

export type NavItem = {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
};

const data = {
  navMain: [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Kunden", url: "/kunden", icon: Users },
    { title: "Aufträge", url: "/auftraege", icon: ClipboardList },
    { title: "Mitarbeiter", url: "/mitarbeiter", icon: UserCog },
    { title: "Kalender", url: "/kalender", icon: Calendar },
    { title: "Kapazität", url: "/kapazität", icon: BarChart3 },
    {
      title: "Offerten & Rechnungen",
      url: "/dokumente",
      icon: FileText,
    },
    { title: "Kennzahlen", url: "/kennzahlen", icon: PieChart },
  ],
  navClouds: [],
  navSecondary: [
    {
      title: "Hilfe",
      url: "/hilfe",
      icon: HelpCircle,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: MessageCircle,
    },
  ],
  meine: [
    {
      title: "Aufgaben",
      url: "/aufgaben",
      icon: ClipboardList,
    },
    {
      title: "Zeitrapportierung",
      url: "/zeitrapportierung",
      icon: TimerIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offExamples" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to="/">
                <ToolCase className="size-6!" />
                <span className="text-base font-semibold">HandwerkPro</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavMeine items={data.meine} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
    </Sidebar>
  );
}
