import { ReactNode, useState, createContext } from "react";
import { Input } from "@/components/ui/input";
// Context to provide search value and setter
export const OrgSearchContext = createContext<{search: string, setSearch: (v: string) => void}>({search: '', setSearch: () => {}});
import { useAuth } from '@/contexts/AuthContext';
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { logout } = useAuth();
  const [search, setSearch] = useState("");
  const handleLogout = () => {
    localStorage.clear();
    logout();
  };
  return (
    <div className="min-h-screen flex w-full bg-muted/20">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-4 w-full">
              <SidebarTrigger />
              <Input
                type="text"
                placeholder="Search organizations..."
                className="w-full max-w-2xl bg-background shadow-sm border-0 focus:border-0 focus-visible:border-0 focus:ring-0 focus-visible:ring-0 outline-none"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full text-[10px] text-primary-foreground flex items-center justify-center">3</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/01.png" alt="Avatar" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <OrgSearchContext.Provider value={{search, setSearch}}>
          <main className="flex-1 overflow-hidden">
            {children}
          </main>
        </OrgSearchContext.Provider>
      </div>
    </div>
  );
};

export default MainLayout;