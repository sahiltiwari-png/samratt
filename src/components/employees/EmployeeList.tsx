import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  employeeCode?: string;
  designation?: string;
  status?: string;
  createdAt?: string;
  dateOfJoining?: string;
  probationEndDate?: string;
  profilePhotoUrl?: string;
}



const EmployeeList = ({ searchTerm }: EmployeeListProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [designationFilter, setDesignationFilter] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

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
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Total Employees - {total}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border bg-white overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm whitespace-nowrap">
            <colgroup>
              <col style={{ width: '16%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '6%' }} />
            </colgroup>
            <thead>
              <tr className="text-gray-700 font-semibold border-b bg-white">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Employee Code</th>
                <th className="px-4 py-2 text-left">Designation</th>
                <th className="px-4 py-2 text-left">Date of Joining</th>
                <th className="px-4 py-2 text-left">Probation End</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-8">Loading...</td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No employees found.</td></tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 flex items-center gap-3 max-w-xs truncate">
                      <Avatar className="h-8 w-8">
                        {emp.profilePhotoUrl ? (
                          <AvatarImage src={emp.profilePhotoUrl} alt={emp.firstName + ' ' + emp.lastName} />
                        ) : (
                          <AvatarFallback>{emp.firstName?.[0] || ''}{emp.lastName?.[0] || ''}</AvatarFallback>
                        )}
                      </Avatar>
                      <div className="truncate flex items-center gap-1">
                        <span className="font-medium text-gray-900 leading-tight text-sm truncate">{emp.firstName} {emp.lastName}</span>
                        <button
                          type="button"
                          className="ml-1 text-gray-400 hover:text-blue-600"
                          title="View details"
                          onClick={() => { setSelectedEmployee(emp); setModalOpen(true); }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h7.125a.375.375 0 0 1 .375.375V20.25M17.25 6l-9 9m0 0h5.25M8.25 15V9.75" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-2 max-w-xs truncate">{emp.employeeCode || '-'}</td>
                    <td className="px-4 py-2 max-w-xs truncate">{emp.designation || '-'}</td>
                    <td className="px-4 py-2 max-w-xs truncate">{emp.dateOfJoining ? new Date(emp.dateOfJoining).toLocaleDateString() : (emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : '-')}</td>
                    <td className="px-4 py-2 max-w-xs truncate">{emp.probationEndDate ? new Date(emp.probationEndDate).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-2">{emp.email || '-'}</td>
                    <td className="px-4 py-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline" className={`min-w-[70px] px-2 py-1 ${emp.status === 'active' ? 'text-green-600 border-green-200' : 'text-red-500 border-red-200'}`}>{emp.status === 'active' ? 'Active' : 'Inactive'}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleStatusChange(emp._id, 'active')} className="text-green-600">Active</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(emp._id, 'inactive')} className="text-red-500">Inactive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                    <td className="px-4 py-2">
                      <Button variant="link" size="icon" className="text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.183L7.5 20.213l-4.243 1.06 1.06-4.243 12.545-12.543ZM19.5 6.75l-1.5-1.5" />
                        </svg>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Employee Details Modal (UI only, no API yet) */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-lg w-full">
            <DialogHeader>
              <DialogTitle>Employee Details</DialogTitle>
            </DialogHeader>
            {selectedEmployee && (
              <div className="space-y-2 text-sm">
                <div><b>Name:</b> {selectedEmployee.firstName} {selectedEmployee.lastName}</div>
                <div><b>Email:</b> {selectedEmployee.email}</div>
                <div><b>Employee Code:</b> {selectedEmployee.employeeCode}</div>
                <div><b>Designation:</b> {selectedEmployee.designation}</div>
                <div><b>Date of Joining:</b> {selectedEmployee.dateOfJoining ? new Date(selectedEmployee.dateOfJoining).toLocaleDateString() : (selectedEmployee.createdAt ? new Date(selectedEmployee.createdAt).toLocaleDateString() : '-')}</div>
                <div><b>Probation End:</b> {selectedEmployee.probationEndDate ? new Date(selectedEmployee.probationEndDate).toLocaleDateString() : '-'}</div>
                <div><b>Status:</b> {selectedEmployee.status}</div>
              </div>
            )}
            <DialogFooter>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => {/* update logic will go here */}}>Update</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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

export default EmployeeList;