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
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User, X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Download, FileText, ChevronDown } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getLeavesReport, LeaveReportData, downloadLeavesReport } from "@/api/leaves";
import { getEmployees, Employee } from "@/api/employees";

interface SelectedEmployee {
  _id: string;
  name: string;
  employeeCode: string;
}

const LeaveRequestsReport = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("all");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedEmployee, setSelectedEmployee] = useState<SelectedEmployee | null>(null);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
  const [employeeSearchResults, setEmployeeSearchResults] = useState<Employee[]>([]);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch leave requests data
  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const params: any = {};
      
      if (startDate) {
        params.startDate = format(startDate, 'yyyy-MM-dd');
      }
      if (endDate) {
        params.endDate = format(endDate, 'yyyy-MM-dd');
      }
      if (selectedEmployee) {
        params.employeeId = selectedEmployee._id;
      }
      if (leaveTypeFilter !== 'all') {
        params.leaveType = leaveTypeFilter;
      }

      const response = await getLeavesReport(params);
      setLeaveRequests(response.data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch leave requests data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load all employees when dropdown is opened
  const loadAllEmployees = async () => {
    try {
      const response = await getEmployees({
        limit: 50, // Load more employees initially
        status: 'active' // Only load active employees
      });
      setEmployeeSearchResults(response.items || []);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  // Search employees for autocomplete
  const searchEmployees = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      // If search term is too short, load all employees
      loadAllEmployees();
      return;
    }

    try {
      const response = await getEmployees({
        search: searchTerm,
        limit: 20,
        status: 'active'
      });
      setEmployeeSearchResults(response.items || []);
    } catch (error) {
      console.error('Error searching employees:', error);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, [startDate, endDate, selectedEmployee, leaveTypeFilter]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (employeeSearchTerm) {
        searchEmployees(employeeSearchTerm);
      } else if (showEmployeeDropdown) {
        // Load all employees when dropdown is shown but no search term
        loadAllEmployees();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [employeeSearchTerm, showEmployeeDropdown]);

  // Pagination
  const totalPages = Math.ceil(leaveRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLeaveRequests = leaveRequests.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [leaveTypeFilter, startDate, endDate, selectedEmployee]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleExportReport = async () => {
    try {
      toast({
        title: "Exporting Report",
        description: "Your report is being prepared for download...",
      });

      const exportParams: any = {};
      
      if (startDate) {
        exportParams.startDate = format(startDate, 'yyyy-MM-dd');
      }
      
      if (endDate) {
        exportParams.endDate = format(endDate, 'yyyy-MM-dd');
      }
      
      if (selectedEmployee) {
        exportParams.employeeId = selectedEmployee._id;
      }
      
      if (leaveTypeFilter && leaveTypeFilter !== 'all') {
        exportParams.leaveType = leaveTypeFilter;
      }

      await downloadLeavesReport(exportParams);
      
      toast({
        title: "Export Successful",
        description: "Your leave requests report has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const selectEmployee = (employee: Employee) => {
    const newEmployee: SelectedEmployee = {
      _id: employee._id,
      name: `${employee.firstName} ${employee.lastName}`,
      employeeCode: employee.employeeCode
    };
    
    setSelectedEmployee(newEmployee);
    setEmployeeSearchTerm("");
    setShowEmployeeDropdown(false);
    setEmployeeSearchResults([]);
  };

  const removeEmployee = () => {
    setSelectedEmployee(null);
  };

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden p-4 sm:p-6"
      style={{
        background:
          "linear-gradient(151.95deg, rgba(76, 220, 156, 0.81) 17.38%, rgba(255, 255, 255, 0.81) 107.36%)",
      }}
    >
      <div className="w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold" style={{color: '#2C373B'}}>Leave requests - {leaveRequests.length}</h2>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              onClick={handleExportReport}
              className="flex items-center gap-2"
              style={{backgroundColor: '#4CDC9C', color: '#2C373B'}}
            >
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Filters - Responsive layout */}
        <div className="bg-emerald-50 rounded-xl shadow-md border border-emerald-200 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Start Date */}
            <div className="w-full">
              <Label className="text-sm font-medium text-emerald-800 mb-2 block">
                Start Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-emerald-300 h-9 hover:bg-emerald-100",
                      !startDate && "text-muted-foreground"
                    )}
                    style={{backgroundColor: 'rgb(209 250 229)'}}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-emerald-600" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="w-full">
              <Label className="text-sm font-medium text-emerald-800 mb-2 block">
                End Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-emerald-300 h-9 hover:bg-emerald-100",
                      !endDate && "text-muted-foreground"
                    )}
                    style={{backgroundColor: 'rgb(209 250 229)'}}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-emerald-600" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Leave Type Filter */}
            <div className="w-full">
              <Label className="text-sm font-medium text-emerald-800 mb-2 block">
                Leave Type
              </Label>
              <Select value={leaveTypeFilter} onValueChange={setLeaveTypeFilter}>
                <SelectTrigger className="border-emerald-300 h-9 hover:bg-emerald-100" style={{backgroundColor: 'rgb(209 250 229)'}}>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="earned">Earned</SelectItem>
                  <SelectItem value="maternity">Maternity</SelectItem>
                  <SelectItem value="paternity">Paternity</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Employee Search */}
            <div className="w-full sm:col-span-2 lg:col-span-1">
              <Label className="text-sm font-medium text-emerald-800 mb-2 block">
                Employee
              </Label>
              <div className="relative">
                <Input
                  placeholder="Search employees..."
                  value={employeeSearchTerm}
                  onChange={(e) => {
                    setEmployeeSearchTerm(e.target.value);
                    setShowEmployeeDropdown(true);
                  }}
                  onFocus={() => {
                    setShowEmployeeDropdown(true);
                    // Load all employees immediately when focused
                    if (employeeSearchResults.length === 0) {
                      loadAllEmployees();
                    }
                  }}
                  onBlur={() => {
                    // Delay hiding dropdown to allow for clicks
                    setTimeout(() => setShowEmployeeDropdown(false), 200);
                  }}
                  className="border-emerald-300 pr-10 h-9 hover:bg-emerald-100"
                  style={{backgroundColor: 'rgb(209 250 229)'}}
                />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-600 h-4 w-4" />
                
                {/* Employee Dropdown */}
                {showEmployeeDropdown && employeeSearchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-emerald-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {employeeSearchResults.map((employee) => (
                      <div
                        key={employee._id}
                        className="px-4 py-2 hover:bg-emerald-50 cursor-pointer border-b border-emerald-100 last:border-b-0"
                        onClick={() => selectEmployee(employee)}
                        onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking
                      >
                        <div className="font-medium text-gray-900">{employee.firstName} {employee.lastName}</div>
                        <div className="text-sm text-emerald-600">{employee.employeeCode}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Employee Tag */}
              {selectedEmployee && (
                <div className="mt-2">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300"
                  >
                    {selectedEmployee.name} ({selectedEmployee.employeeCode})
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-500"
                      onClick={removeEmployee}
                    />
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden">
          {loading ? (
            <div className="bg-white rounded-xl shadow-md border p-6">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-4"></div>
                <p className="text-lg font-medium">Loading...</p>
              </div>
            </div>
          ) : currentLeaveRequests.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md border p-6">
              <div className="flex flex-col items-center">
                <FileText className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-lg font-medium">No leave requests found</p>
                <p className="text-sm text-gray-500">Try adjusting your filter criteria</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {currentLeaveRequests.map((request, index) => (
                <div key={`${request.employeeCode}-${index}`} className="bg-white rounded-xl shadow-md border p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      {request.profilePhotoUrl ? (
                        <AvatarImage src={request.profilePhotoUrl} alt={request.employeeName} />
                      ) : null}
                      <AvatarFallback className="bg-emerald-100 text-emerald-700">
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" style={{color: '#2C373B'}}>
                        {request.employeeName}
                      </div>
                      <div className="text-sm text-emerald-600">
                        {request.employeeCode}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {request.designation} • {request.department}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500 font-medium">Leave Type:</span>
                      <div className="capitalize mt-1" style={{color: '#2C373B'}}>{request.leaveType}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Days:</span>
                      <div className="mt-1" style={{color: '#2C373B'}}>{request.days}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Start Date:</span>
                      <div className="mt-1" style={{color: '#2C373B'}}>{formatDate(request.startDate)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">End Date:</span>
                      <div className="mt-1" style={{color: '#2C373B'}}>{formatDate(request.endDate)}</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-gray-500 font-medium text-sm">Reason:</span>
                    <div className="text-gray-900 text-sm mt-1 break-words">{request.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-xl shadow-md border">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="border-b" style={{ background: '#2C373B', color: '#FFFFFF', lineHeight: '18px' }}>
                <tr>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap" style={{fontSize: '12px', fontWeight: 600, color: '#FFFFFF', lineHeight: '18px'}}>
                    Employee
                  </th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap" style={{fontSize: '12px', fontWeight: 600, color: '#FFFFFF', lineHeight: '18px'}}>
                    Leave Type
                  </th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap" style={{fontSize: '12px', fontWeight: 600, color: '#FFFFFF', lineHeight: '18px'}}>
                    Start Date
                  </th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap" style={{fontSize: '12px', fontWeight: 600, color: '#FFFFFF', lineHeight: '18px'}}>
                    End Date
                  </th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap" style={{fontSize: '12px', fontWeight: 600, color: '#FFFFFF', lineHeight: '18px'}}>
                    Reason
                  </th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap" style={{fontSize: '12px', fontWeight: 600, color: '#FFFFFF', lineHeight: '18px'}}>
                    Days
                  </th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap" style={{fontSize: '12px', fontWeight: 600, color: '#FFFFFF', lineHeight: '18px'}}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-4"></div>
                        <p className="text-lg font-medium">Loading...</p>
                      </div>
                    </td>
                  </tr>
                ) : currentLeaveRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <FileText className="h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-lg font-medium">No leave requests found</p>
                        <p className="text-sm">Try adjusting your filter criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentLeaveRequests.map((request, index) => (
                    <tr key={`${request.employeeCode}-${index}`} className="hover:bg-emerald-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            {request.profilePhotoUrl ? (
                              <AvatarImage src={request.profilePhotoUrl} alt={request.employeeName} />
                            ) : null}
                            <AvatarFallback className="bg-emerald-100 text-emerald-700">
                              <User className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-4 min-w-0 flex-1">
                            <div className="text-sm font-medium truncate" style={{fontSize: '14px', fontWeight: 500, color: '#2C373B'}}>
                              {request.employeeName}
                            </div>
                            <div className="text-sm text-emerald-600">
                              {request.employeeCode}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm capitalize" style={{fontSize: '14px', fontWeight: 500, color: '#2C373B'}}>{request.leaveType}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm" style={{fontSize: '14px', fontWeight: 500, color: '#2C373B'}}>{formatDate(request.startDate)}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm" style={{fontSize: '14px', fontWeight: 500, color: '#2C373B'}}>{formatDate(request.endDate)}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm max-w-xs truncate" style={{fontSize: '14px', fontWeight: 500, color: '#2C373B'}} title={request.reason}>
                          {request.reason}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm" style={{fontSize: '14px', fontWeight: 500, color: '#2C373B'}}>{request.days}</div>
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(request.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {!loading && leaveRequests.length > itemsPerPage && (
          <div className="bg-white rounded-xl shadow-md border p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
              <div className="text-sm text-gray-600 font-medium text-center lg:text-left">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, leaveRequests.length)} of {leaveRequests.length} results
              </div>
              
              <div className="flex items-center gap-2 lg:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Prev</span>
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show fewer pages on mobile
                    const isMobile = window.innerWidth < 640;
                    const showPage = isMobile 
                      ? (page === 1 || page === totalPages || page === currentPage || 
                         (page >= currentPage - 1 && page <= currentPage + 1))
                      : (page === 1 || page === totalPages || 
                         (page >= currentPage - 2 && page <= currentPage + 2));
                    
                    if (!showPage) {
                      // Show ellipsis
                      const ellipsisCondition = isMobile 
                        ? (page === currentPage - 2 || page === currentPage + 2)
                        : (page === currentPage - 3 || page === currentPage + 3);
                      
                      if (ellipsisCondition) {
                        return <span key={page} className="px-1 lg:px-2 py-1 text-gray-400 text-sm">...</span>;
                      }
                      return null;
                    }

                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[36px] lg:min-w-[40px] h-9 lg:h-10 text-sm font-medium ${
                          currentPage === page 
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" 
                            : "text-gray-700 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequestsReport;