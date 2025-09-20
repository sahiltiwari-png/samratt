import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EmployeeListProps {
  searchTerm: string;
}

const employees = [
  {
    id: 1,
    name: "Alice Johnson",
    position: "Senior Developer",
    department: "Engineering",
    email: "alice.johnson@company.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    status: "Active",
    avatar: "/avatars/alice.jpg",
    initials: "AJ"
  },
  {
    id: 2,
    name: "Bob Smith",
    position: "Product Manager",
    department: "Product",
    email: "bob.smith@company.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    status: "Active",
    avatar: "/avatars/bob.jpg",
    initials: "BS"
  },
  {
    id: 3,
    name: "Carol Davis",
    position: "UX Designer",
    department: "Design",
    email: "carol.davis@company.com",
    phone: "+1 (555) 345-6789",
    location: "Austin, TX",
    status: "Active",
    avatar: "/avatars/carol.jpg",
    initials: "CD"
  },
  {
    id: 4,
    name: "David Wilson",
    position: "DevOps Engineer",
    department: "Engineering",
    email: "david.wilson@company.com",
    phone: "+1 (555) 456-7890",
    location: "Seattle, WA",
    status: "On Leave",
    avatar: "/avatars/david.jpg",
    initials: "DW"
  },
  {
    id: 5,
    name: "Emma Brown",
    position: "Marketing Manager",
    department: "Marketing",
    email: "emma.brown@company.com",
    phone: "+1 (555) 567-8901",
    location: "Chicago, IL",
    status: "Active",
    avatar: "/avatars/emma.jpg",
    initials: "EB"
  },
  {
    id: 6,
    name: "Frank Miller",
    position: "Sales Representative",
    department: "Sales",
    email: "frank.miller@company.com",
    phone: "+1 (555) 678-9012",
    location: "Miami, FL",
    status: "Active",
    avatar: "/avatars/frank.jpg",
    initials: "FM"
  }
];

export const EmployeeList = ({ searchTerm }: EmployeeListProps) => {
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="hrms-card">
      <CardHeader>
        <CardTitle>Employee Directory</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <Avatar className="h-12 w-12">
                <AvatarImage src={employee.avatar} alt={employee.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {employee.initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{employee.name}</h3>
                  <Badge 
                    className={employee.status === 'Active' 
                      ? 'hrms-status-success' 
                      : 'hrms-status-warning'
                    }
                  >
                    {employee.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {employee.position} • {employee.department}
                </p>
                
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{employee.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Mail className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Send Message</DropdownMenuItem>
                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
        
        {filteredEmployees.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No employees found matching your search.
          </div>
        )}
      </CardContent>
    </Card>
  );
};