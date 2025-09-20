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
      ? "bg-primary text-white hover:bg-primary/90 font-semibold" 
      : "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <Sidebar className={`bg-gray-800 border-r border-gray-700 ${state === "collapsed" ? "w-14" : "w-64"}`}>
      <SidebarHeader className="border-b border-gray-700 p-4">
        {state !== "collapsed" && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HR</span>
            </div>
            <div>
              <h1 className="font-semibold text-lg text-white">HRMS Pro</h1>
              <p className="text-xs text-gray-400">Human Resource Management</p>
            </div>
          </div>
        )}
        {state === "collapsed" && (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">HR</span>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 uppercase text-xs font-medium px-2 mb-2">
            {state !== "collapsed" ? "Main Menu" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full">
                    <NavLink
                      to={item.url}
                      className={`${getNavClassName(item.url)} transition-all duration-200 flex items-center gap-3 px-3 py-2.5 rounded-md w-full text-sm`}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-gray-400 uppercase text-xs font-medium px-2 mb-2">
            {state !== "collapsed" ? "Administration" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {adminNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full">
                    <NavLink
                      to={item.url}
                      className={`${getNavClassName(item.url)} transition-all duration-200 flex items-center gap-3 px-3 py-2.5 rounded-md w-full text-sm`}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-700 p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
        >
          <LogOut className="h-4 w-4" />
          {state !== "collapsed" && <span className="ml-2">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}