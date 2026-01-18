"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import type { NavItem } from "./app-sidebar";
import NavLink from "./nav-link";

export function NavMeine({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Meine Arbeit</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavLink item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
