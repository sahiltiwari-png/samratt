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
import { User, X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { getPayrollReport, PayrollReportItem } from "@/api/payroll";
import { getEmployees, Employee } from "@/api/employees";

interface SelectedEmployee {
  _id: string;
  name: string;
  employeeCode: string;
}

const PayrollReport = () => {
  const [payrollData, setPayrollData] = useState<PayrollReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [selectedEmployee, setSelectedEmployee] = useState<SelectedEmployee | null>(null);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
  const [employeeSearchResults, setEmployeeSearchResults] = useState<Employee[]>([]);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const statusOptions = [
    "All Status",
    "pending",
    "processed",
    "paid",
    "hold",
    "cancelled"
  ];

  // Search employees
  const searchEmployees = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setEmployeeSearchResults([]);
      return;
    }

    try {
      const response = await getEmployees({ search: searchTerm, limit: 10 });
      setEmployeeSearchResults(response.data || []);
    } catch (error) {
      console.error('Error searching employees:', error);
      setEmployeeSearchResults([]);
    }
  };

  // Fetch payroll data
  const fetchPayrollData = async () => {
    try {
      setLoading(true);
      const params: any = {};

      if (selectedEmployee) {
        params.employeeId = selectedEmployee._id;
      }
      
      if (startDate) {
        params.startDate = format(startDate, 'yyyy-MM-dd');
      }
      
      if (endDate) {
        params.endDate = format(endDate, 'yyyy-MM-dd');
      }

      if (statusFilter && statusFilter !== "All Status") {
        params.status = statusFilter;
      }

      const response = await getPayrollReport(params);
      setPayrollData(response.data || []);
    } catch (error) {
      console.error('Error fetching payroll data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payroll data",
        variant: "destructive",
      });
      setPayrollData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee({
      _id: employee._id,
      name: `${employee.firstName} ${employee.lastName}`,
      employeeCode: employee.employeeCode || ''
    });
    setEmployeeSearchTerm(`${employee.firstName} ${employee.lastName}`);
    setShowEmployeeDropdown(false);
    setCurrentPage(1);
  };

  const clearEmployeeFilter = () => {
    setSelectedEmployee(null);
    setEmployeeSearchTerm("");
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setStatusFilter("pending");
    setSelectedEmployee(null);
    setEmployeeSearchTerm("");
    setCurrentPage(1);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'processed':
        return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'paid':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'hold':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // Pagination
  const totalPages = Math.ceil(payrollData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayrollData = payrollData.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  useEffect(() => {
    fetchPayrollData();
  }, [startDate, endDate, statusFilter, selectedEmployee]);

  useEffect(() => {
    if (employeeSearchTerm && showEmployeeDropdown) {
      const debounceTimer = setTimeout(() => {
        searchEmployees(employeeSearchTerm);
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [employeeSearchTerm, showEmployeeDropdown]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-200 via-emerald-100 to-emerald-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Payroll Report
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage payroll data for employees
            </p>
          </div>

          {/* Filters - Single Responsive Line */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg shadow-sm p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Start Date */}
              <div className="space-y-2">
                <Label className="text-emerald-700 font-medium">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-emerald-600" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
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
              <div className="space-y-2">
                <Label className="text-emerald-700 font-medium">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-emerald-600" />
                      {endDate ? format(endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label className="text-emerald-700 font-medium">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Employee Search */}
              <div className="space-y-2 relative">
                <Label className="text-emerald-700 font-medium">Employee</Label>
                <div className="relative">
                  <Input
                    placeholder="Search employees..."
                    value={employeeSearchTerm}
                    onChange={(e) => {
                      setEmployeeSearchTerm(e.target.value);
                      setShowEmployeeDropdown(true);
                    }}
                    onFocus={() => setShowEmployeeDropdown(true)}
                    className="w-full pr-8 border-emerald-300 hover:border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                  {selectedEmployee && (
                    <button
                      onClick={clearEmployeeFilter}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-emerald-400 hover:text-emerald-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  {showEmployeeDropdown && employeeSearchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 bg-white border border-emerald-200 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                      {employeeSearchResults.map((employee) => (
                        <button
                          key={employee._id}
                          onClick={() => handleEmployeeSelect(employee)}
                          className="w-full px-3 py-2 text-left hover:bg-emerald-50 flex items-center gap-3"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={employee.profilePhotoUrl} />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">
                              {employee.firstName} {employee.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee.employeeCode} • {employee.designation}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button 
                onClick={clearAllFilters} 
                variant="outline" 
                size="sm"
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading payroll data...</p>
            </div>
          ) : (
            <>
              {/* Mobile View */}
              <div className="lg:hidden">
                <div className="p-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600">
                    Showing {payrollData.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, payrollData.length)} of {payrollData.length} records
                  </p>
                </div>
                {payrollData.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p>No payroll data found</p>
                    <p className="text-sm mt-1">Try adjusting your filters</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {currentPayrollData.map((item, index) => (
                      <div key={`${item.employeeCode}-${index}`} className="p-4 space-y-3">
                        {/* Employee Info */}
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={item.profilePhotoUrl} />
                            <AvatarFallback>
                              <User className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {item.employeeName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {item.employeeCode}
                            </p>
                          </div>
                          <Badge className={getStatusBadgeColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>

                        {/* Salary Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Basic:</span>
                            <span className="ml-2 font-medium">₹{item.grossEarnings?.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">HRA:</span>
                            <span className="ml-2 font-medium">₹0</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Gross:</span>
                            <span className="ml-2 font-medium">₹{item.grossEarnings?.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Deductions:</span>
                            <span className="ml-2 font-medium">₹{parseFloat(item.deductions || '0').toLocaleString()}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-600">Net Salary:</span>
                            <span className="ml-2 font-medium text-emerald-600">₹{parseFloat(item.netPayable || '0').toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Basic
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        HRA
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gross Earning
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deduction
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Net Salary
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payrollData.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                          <p>No payroll data found</p>
                          <p className="text-sm mt-1">Try adjusting your filters</p>
                        </td>
                      </tr>
                    ) : (
                      currentPayrollData.map((item, index) => (
                        <tr key={`${item.employeeCode}-${index}`} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={item.profilePhotoUrl} />
                                <AvatarFallback>
                                  <User className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {item.employeeName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {item.designation}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.employeeCode}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{item.grossEarnings?.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹0
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{item.grossEarnings?.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{parseFloat(item.deductions || '0').toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">
                            ₹{parseFloat(item.netPayable || '0').toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getStatusBadgeColor(item.status)}>
                              {item.status}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-700">
                      Showing {startIndex + 1} to {Math.min(endIndex, payrollData.length)} of {payrollData.length} results
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => goToPage(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showEmployeeDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowEmployeeDropdown(false)}
        />
      )}
    </div>
  );
};

export default PayrollReport;