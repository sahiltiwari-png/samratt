import { ReactNode, useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { getEmployeeById } from "@/api/employees";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { logout, user } = useAuth();
  const [search, setSearch] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    logout();
  };
  const handleProfile = () => {
    navigate('/settings');
  };
  // Prefer profilePhotoUrl, then fallback to profileImage; if missing, fetch employee
  useEffect(() => {
    const preferred = user?.profilePhotoUrl || user?.profileImage;
    setAvatarUrl(preferred);
    const id = (user as any)?._id || (user as any)?.id;
    if (!preferred && id) {
      getEmployeeById(id)
        .then((emp: any) => {
          if (emp?.profilePhotoUrl) setAvatarUrl(emp.profilePhotoUrl);
        })
        .catch(() => {});
    }
  }, [user?.profilePhotoUrl, user?.profileImage, (user as any)?._id, (user as any)?.id]);
  const avatarSrc = avatarUrl;
  const placeholderSrc = (!avatarSrc && (user?.name || user?.firstName || user?.lastName))
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
        (user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`).trim()
      )}&background=E8F5E9&color=2C373B&size=64`
    : undefined;
  return (
    <div className="min-h-screen flex w-full bg-muted/20">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-4 w-full">
              <SidebarTrigger />
              {user?.role === 'superAdmin' ? (
                <Input
                  type="text"
                  placeholder="Search organizations..."
                  className="w-full max-w-2xl bg-background shadow-sm border-0 focus:border-0 focus-visible:border-0 focus:ring-0 focus-visible:ring-0 outline-none"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              ) : null}
            </div>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      {(avatarSrc || placeholderSrc) && (
                        <AvatarImage src={avatarSrc || placeholderSrc} alt="Avatar" />
                      )}
                      <AvatarFallback><User className="h-6 w-6 text-muted-foreground" /></AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onClick={handleProfile}>
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