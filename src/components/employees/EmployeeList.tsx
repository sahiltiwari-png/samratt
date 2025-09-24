import { useEffect, useState } from "react";
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
import { getEmployees } from "@/api/employees";



interface EmployeeListProps {
  searchTerm: string;
}

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeCode: string;
  designation: string;
  status: string;
  createdAt: string;
}



export const EmployeeList = ({ searchTerm }: EmployeeListProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [designationFilter, setDesignationFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        // Assume getEmployees accepts params for page, limit, status, designation, search
        const data = await getEmployees({ page, limit: 10, status: statusFilter, designation: designationFilter, search: searchTerm });
        setEmployees(Array.isArray(data.items) ? data.items : []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setEmployees([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [page, statusFilter, designationFilter, searchTerm]);

  const handleStatusChange = (id: string, newStatus: string) => {
    setEmployees((prev) => prev.map(emp => emp._id === id ? { ...emp, status: newStatus } : emp));
    // TODO: Call API to update status if needed
  };

  const clearFilters = () => {
    setStatusFilter(null);
    setDesignationFilter(null);
  };

  return (
    <Card className="shadow-md rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Total Employees - {total}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={statusFilter ? 'default' : 'outline'} className="min-w-[120px]">Status</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('active')}>Active</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>Inactive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={designationFilter ? 'default' : 'outline'} className="min-w-[140px]">Designation</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setDesignationFilter(null)}>All</DropdownMenuItem>
              {/* You can map designations dynamically if needed */}
              <DropdownMenuItem onClick={() => setDesignationFilter('Company Admin')}>Company Admin</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDesignationFilter('Employee')}>Employee</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDesignationFilter('HR')}>HR</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" onClick={clearFilters} className="ml-2">Clear filters</Button>
        </div>
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="text-gray-700 text-sm font-semibold border-b">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Employee code</th>
                <th className="px-4 py-3 text-left">Roles</th>
                <th className="px-4 py-3 text-left">Date of Joining</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8">Loading...</td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No employees found.</td></tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{emp.firstName[0]}{emp.lastName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">{emp.firstName} {emp.lastName}</div>
                        <div className="text-xs text-gray-500">{emp.designation}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{emp.employeeCode}</td>
                    <td className="px-4 py-3">{emp.designation}</td>
                    <td className="px-4 py-3">{emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3">{emp.email}</td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline" className={`min-w-[80px] ${emp.status === 'active' ? 'text-green-600 border-green-200' : 'text-red-500 border-red-200'}`}>{emp.status === 'active' ? 'Active' : 'Inactive'}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleStatusChange(emp._id, 'active')} className="text-green-600">Active</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(emp._id, 'inactive')} className="text-red-500">Inactive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="link" size="sm" className="text-blue-600">Edit</Button>
                      <Button variant="link" size="sm" className="text-blue-400 ml-2">Update</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button key={p} variant={p === page ? 'default' : 'ghost'} size="sm" className="mx-1" onClick={() => setPage(p)}>{p}</Button>
            ))}
            <Button variant="ghost" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};