import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, ChevronDown, X, Search, ChevronLeft, ChevronRight, Plus, Calendar, Clock, Edit, Eye, Filter, Trash2, Download, FileText } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { getEmployeesReport, downloadEmployeesReport, EmployeesReportResponse } from "@/api/employees";

interface EmployeeReportData {
  _id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  designation: string;
  dateOfJoining: string;
  probationEndDate?: string;
  status: string;
  department?: string;
  profilePhotoUrl?: string;
}

const EmployeesReport = () => {
  const [employees, setEmployees] = useState<EmployeeReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch employees data from API
  const fetchEmployees = async (status?: string) => {
    try {
      setLoading(true);
      setError(null);
      const params = status === "all" ? undefined : { status: status };
      const response = await getEmployeesReport(params);
      setEmployees(response.data || []);
    } catch (err) {
      setError("Failed to fetch employees data");
      console.error("Error fetching employees:", err);
      toast({
        title: "Error",
        description: "Failed to fetch employees data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when status filter changes
  useEffect(() => {
    fetchEmployees(statusFilter);
  }, [statusFilter]);





  // Pagination
  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = employees.slice(startIndex, endIndex);

  const handleExportReport = async () => {
    try {
      toast({
        title: "Export Started",
        description: "Employee report is being generated...",
      });

      const params = statusFilter === "all" ? undefined : { status: statusFilter };
      const response = await downloadEmployeesReport(params);
      
      // Create blob and download file
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/octet-stream' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'employees-report.xlsx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Completed",
        description: "Employee report has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to download employee report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-emerald-50 to-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-emerald-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-emerald-100 rounded"></div>
              <div className="h-4 bg-emerald-100 rounded w-5/6"></div>
              <div className="h-4 bg-emerald-100 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-emerald-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-medium" style={{color: '#2C373B'}}>
              Employees Report - {employees.length} employees
            </h2>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Export Report Button */}
            <Button 
              onClick={handleExportReport}
              className="hover:bg-emerald-700"
              style={{backgroundColor: '#4CDC9C', color: '#2C373B'}}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            

          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">


          <div className="flex items-center gap-2">
            <Label htmlFor="status-filter" className="text-sm font-medium">Status:</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]" style={{height: '36px', backgroundColor: 'rgb(209 250 229)'}}>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {statusFilter !== "all" && (
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="text-emerald-600 border-emerald-300 hover:bg-emerald-50"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-emerald-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-emerald-50 border-b border-emerald-200">
                 <tr>
                   <th className="text-left p-4 font-medium text-emerald-900" style={{fontSize: '12px', fontWeight: 600}}>Name</th>
                   <th className="text-left p-4 font-medium text-emerald-900" style={{fontSize: '12px', fontWeight: 600}}>Employee Code</th>
                   <th className="text-left p-4 font-medium text-emerald-900" style={{fontSize: '12px', fontWeight: 600}}>Date of Joining</th>
                   <th className="text-left p-4 font-medium text-emerald-900" style={{fontSize: '12px', fontWeight: 600}}>Probation End</th>
                   <th className="text-left p-4 font-medium text-emerald-900" style={{fontSize: '12px', fontWeight: 600}}>Email</th>
                   <th className="text-left p-4 font-medium text-emerald-900" style={{fontSize: '12px', fontWeight: 600}}>Status</th>
                 </tr>
               </thead>
               <tbody>
                 {loading ? (
                   <tr>
                     <td colSpan={6} className="p-8 text-center text-gray-500">
                       Loading employees...
                     </td>
                   </tr>
                 ) : currentEmployees.length === 0 ? (
                   <tr>
                     <td colSpan={6} className="p-8 text-center text-gray-500">
                       No data found
                     </td>
                   </tr>
                 ) : (
                   currentEmployees.map((employee, index) => (
                     <tr key={employee._id} className={`border-b border-emerald-100 hover:bg-emerald-25 ${index % 2 === 0 ? 'bg-white' : 'bg-emerald-25/30'}`}>
                       <td className="p-4">
                         <div className="flex items-center gap-3">
                           <Avatar className="h-10 w-10">
                             {employee.profilePhotoUrl ? (
                               <AvatarImage src={employee.profilePhotoUrl} alt={`${employee.firstName} ${employee.lastName}`} />
                             ) : (
                               <AvatarFallback className="bg-emerald-100 text-emerald-600">
                                 <User className="h-5 w-5" />
                               </AvatarFallback>
                             )}
                           </Avatar>
                           <div>
                             <div className="font-medium" style={{fontSize: '14px', fontWeight: 500, color: '#2C373B'}}>
                               {employee.firstName} {employee.lastName}
                             </div>
                             <div className="text-sm text-gray-500">
                               {employee.designation}
                             </div>
                           </div>
                         </div>
                       </td>
                       <td className="p-4" style={{fontSize: '14px', fontWeight: 500, color: '#2C373B'}}>{employee.employeeCode}</td>
                       <td className="p-4" style={{fontSize: '14px', fontWeight: 500, color: '#2C373B'}}>
                         {new Date(employee.dateOfJoining).toLocaleDateString()}
                       </td>
                       <td className="p-4" style={{fontSize: '14px', fontWeight: 500, color: '#2C373B'}}>
                         {employee.probationEndDate 
                           ? new Date(employee.probationEndDate).toLocaleDateString()
                           : 'N/A'
                         }
                       </td>
                       <td className="p-4" style={{fontSize: '14px', fontWeight: 500, color: '#2C373B'}}>{employee.email}</td>
                       <td className="p-4">
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                           employee.status.toLowerCase() === 'active' 
                             ? 'bg-green-100 text-green-800' 
                             : 'bg-red-100 text-red-800'
                         }`}>
                           {employee.status}
                         </span>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-emerald-50 border-t border-emerald-200">
              <div className="text-sm text-emerald-700">
                Showing {startIndex + 1} to {Math.min(endIndex, employees.length)} of {employees.length} employees
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-emerald-700">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default EmployeesReport;