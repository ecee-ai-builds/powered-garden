import { Terminal, Settings, MessageSquare } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
const items = [{
  title: "Command",
  url: "/",
  icon: Terminal
}, {
  title: "Chat",
  url: "/chat",
  icon: MessageSquare
}, {
  title: "Settings",
  url: "/settings",
  icon: Settings
}];
export function AppSidebar() {
  const {
    open
  } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath === path;
  return <Sidebar className={`${open ? "w-64" : "w-16"} border-r-2 border-primary/30 bg-sidebar transition-all duration-300`} collapsible="icon">
      <div className="flex items-center justify-between p-4 border-b-2 border-primary/30">
        {open && <h2 className="text-lg font-bold text-primary cyber-glow tracking-wider">AI POWERED GARDEN</h2>}
      </div>

      <SidebarContent>
        <SidebarGroup>
          {open && <SidebarGroupLabel className="text-primary/70 text-xs tracking-widest">
              MAIN_MENU
            </SidebarGroupLabel>}

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={`
                        hover:bg-primary/10 hover:text-primary transition-all duration-200
                        ${!open && "justify-center"}
                      `} activeClassName="bg-primary/20 text-primary border-l-2 border-primary">
                      <item.icon className={`h-5 w-5 ${isActive(item.url) ? 'cyber-glow' : ''}`} />
                      {open && <span className="tracking-wide">{item.title.toUpperCase()}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
}