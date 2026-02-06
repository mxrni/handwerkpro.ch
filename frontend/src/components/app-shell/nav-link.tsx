import { Link, useLocation } from "@tanstack/react-router";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import type { NavItem } from "./app-sidebar";

export default function NavLink({ item }: { item: NavItem }) {
  const pathname = useLocation().pathname;

  const isActive =
    item.url === "/" ? pathname === item.url : pathname.startsWith(item.url);

  return (
    <SidebarMenuItem key={item.title}>
      <Link to={item.url}>
        <SidebarMenuButton tooltip={item.title} isActive={isActive}>
          {item.icon && (
            <item.icon className={isActive ? "stroke-[2.75]" : "stroke-2"} />
          )}
          <span>{item.title}</span>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );
}
