import { NavLink, useLocation } from "react-router-dom";
import {
  Calendar,
  Clock,
  Home,
  Settings,
  Users,
  FileText,
  User,
  Shield,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigation = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Attendance", url: "/attendance", icon: Clock },
  { title: "Leave Management", url: "/leaves", icon: Calendar },
  { title: "Employees", url: "/employees", icon: Users },
  { title: "Profile", url: "/profile", icon: User },
];

const adminNavigation = [
  { title: "Admin Panel", url: "/admin", icon: Shield },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path || location.pathname === "/" && path === "/dashboard";
  
  const getNavClassName = (path: string) => 
    isActive(path) 
      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
      : "hover:bg-muted text-sidebar-text hover:text-foreground";

  return (
    <Sidebar className={`hrms-sidebar ${state === "collapsed" ? "w-14" : "w-64"}`}>
      <SidebarHeader className="border-b border-border/10 p-4">
        {state !== "collapsed" && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">HR</span>
            </div>
            <div>
              <h1 className="font-semibold text-lg text-sidebar-text">HRMS Pro</h1>
              <p className="text-xs text-sidebar-text/70">Human Resource Management</p>
            </div>
          </div>
        )}
        {state === "collapsed" && (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-bold text-sm">HR</span>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-text/70 uppercase text-xs font-medium px-2">
            {state !== "collapsed" ? "Main Menu" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`${getNavClassName(item.url)} transition-all duration-200 flex items-center gap-3 px-3 py-2 rounded-md`}
                    >
                      <item.icon className="h-4 w-4" />
                      {state !== "collapsed" && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-text/70 uppercase text-xs font-medium px-2">
            {state !== "collapsed" ? "Administration" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`${getNavClassName(item.url)} transition-all duration-200 flex items-center gap-3 px-3 py-2 rounded-md`}
                    >
                      <item.icon className="h-4 w-4" />
                      {state !== "collapsed" && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/10 p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-text hover:text-foreground hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          {state !== "collapsed" && <span className="ml-2">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}