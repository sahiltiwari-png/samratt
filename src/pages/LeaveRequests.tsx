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
import { User, ChevronDown, X, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { getLeaveRequests, LeaveRequest, Employee, updateLeaveRequestStatus } from "@/api/leaves";
import { getEmployees, Employee as EmployeeType, EmployeesResponse } from "@/api/employees";
import { toast } from "@/components/ui/use-toast";

const LeaveRequests = () => {
  const [status, setStatus] = useState<string>("all");
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRequests, setTotalRequests] = useState(0);
  
  // Employee search states
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(null);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Edit states
  const [editingRows, setEditingRows] = useState<Set<string>>(new Set());
  const [editValues, setEditValues] = useState<{[key: string]: {status: string, remarks: string}}>({});
  const [updating, setUpdating] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchLeaveRequests();
  }, [selectedEmployee, status]);

  // Search employees when user types or when dropdown is opened
  useEffect(() => {
    if (showEmployeeDropdown) {
      searchEmployees();
    }
  }, [employeeSearch, showEmployeeDropdown]);

  const searchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response: EmployeesResponse = await getEmployees({
        search: employeeSearch,
        limit: 10,
        status: 'active'
      });
      setEmployees(response.items);
      setShowEmployeeDropdown(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search employees",
        variant: "destructive",
      });
    } finally {
      setLoadingEmployees(false);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', '1');
      params.append('limit', '100');
      
      if (status !== 'all') {
        params.append('status', status);
      }
      
      if (selectedEmployee) {
        // Add userId parameter for selected employee
        params.append('userId', selectedEmployee._id);
      }
      
      const queryString = params.toString();
      const url = `/leaves${queryString ? `?${queryString}` : ''}`;
      
      // Use the existing getLeaveRequests function but we need to modify it to accept filters
      const response = await getLeaveRequests(1, 100, status !== 'all' ? status : undefined, selectedEmployee ? [selectedEmployee._id] : undefined);
      setRequests(response.items);
      setTotalRequests(response.total);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch leave requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for employee selection
  const selectEmployee = (employee: EmployeeType) => {
    setSelectedEmployee(employee);
    setEmployeeSearch(`${employee.firstName} ${employee.lastName} (${employee.employeeCode})`);
    setShowEmployeeDropdown(false);
  };

  const clearEmployee = () => {
    setSelectedEmployee(null);
    setEmployeeSearch("");
  };

  const handleSearchFocus = () => {
    setShowEmployeeDropdown(true);
  };

  const handleSearchClick = () => {
    setShowEmployeeDropdown(true);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.employee-search-container')) {
        setShowEmployeeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (status !== "all" && r.status.toLowerCase() !== status.toLowerCase()) return false;
      return true;
    });
  }, [requests, status]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [status, selectedEmployee]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return "bg-green-100 text-green-700";
      case 'rejected':
        return "bg-red-100 text-red-700";
      case 'applied':
      case 'pending':
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleEdit = (request: LeaveRequest) => {
    const newEditingRows = new Set(editingRows);
    newEditingRows.add(request._id);
    setEditingRows(newEditingRows);
    
    setEditValues(prev => ({
      ...prev,
      [request._id]: {
        status: request.status,
        remarks: request.remarks || ''
      }
    }));
  };

  const handleCancelEdit = (requestId: string) => {
    const newEditingRows = new Set(editingRows);
    newEditingRows.delete(requestId);
    setEditingRows(newEditingRows);
    
    setEditValues(prev => {
      const newValues = { ...prev };
      delete newValues[requestId];
      return newValues;
    });
  };

  const handleUpdate = async (requestId: string) => {
    const editValue = editValues[requestId];
    if (!editValue) return;

    const newUpdating = new Set(updating);
    newUpdating.add(requestId);
    setUpdating(newUpdating);

    try {
      await updateLeaveRequestStatus(requestId, editValue.status, editValue.remarks);
      
      // Update the local state
      setRequests(prev => prev.map(req => 
        req._id === requestId 
          ? { ...req, status: editValue.status, remarks: editValue.remarks }
          : req
      ));

      // Exit edit mode
      handleCancelEdit(requestId);
      
      toast({
        title: "Success",
        description: "Leave request updated successfully",
      });
    } catch (error) {
      console.error('Error updating leave request:', error);
      toast({
        title: "Error",
        description: "Failed to update leave request",
        variant: "destructive",
      });
    } finally {
      const newUpdating = new Set(updating);
      newUpdating.delete(requestId);
      setUpdating(newUpdating);
    }
  };

  const handleEditValueChange = (requestId: string, field: 'status' | 'remarks', value: string) => {
    setEditValues(prev => ({
      ...prev,
      [requestId]: {
        ...prev[requestId],
        [field]: value
      }
    }));
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-emerald-50 to-white px-2 py-6 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
           <div>
             <h2 className="text-base font-medium" style={{color: '#2C373B'}}>
               Leave Request - {totalRequests}
             </h2>
           </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Employee Search Filter */}
            <div className="relative employee-search-container">
              <div 
                className="flex items-center gap-2 border border-emerald-300 rounded-lg px-3 py-2 bg-white w-full sm:w-[320px] hover:border-emerald-400 focus-within:border-emerald-500 transition-colors h-10 cursor-pointer"
                onClick={handleSearchClick}
              >
                <Search className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                
                {selectedEmployee ? (
                  <div className="flex items-center gap-2 flex-1">
                    {/* Selected Employee Tag */}
                    <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-sm border border-emerald-200">
                      <Avatar className="h-4 w-4">
                        {selectedEmployee.profilePhotoUrl ? (
                          <AvatarImage src={selectedEmployee.profilePhotoUrl} alt={`${selectedEmployee.firstName} ${selectedEmployee.lastName}`} />
                        ) : (
                          <AvatarFallback className="text-xs bg-emerald-200 text-emerald-700">
                            {selectedEmployee.firstName[0]}{selectedEmployee.lastName[0]}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="font-medium">{selectedEmployee.firstName} {selectedEmployee.lastName}</span>
                      <span className="text-emerald-600 font-semibold">({selectedEmployee.employeeCode})</span>
                      <button
                         onClick={(e) => {
                           e.stopPropagation();
                           clearEmployee();
                         }}
                         className="hover:bg-emerald-200 rounded-full p-0.5 transition-colors ml-1"
                       >
                        <X className="h-3 w-3 text-emerald-600" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <Input
                  placeholder="Click to select employee..."
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  onFocus={handleSearchFocus}
                  onClick={handleSearchClick}
                  className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm placeholder:text-gray-400 cursor-pointer flex-1 h-8"
                  style={{backgroundColor: 'rgb(209 250 229)', color: '#2C373B'}}
                />
                )}
              </div>
              
              {/* Employee Dropdown */}
              {showEmployeeDropdown && (employees.length > 0 || loadingEmployees) && (
                <div className="absolute top-full left-0 right-0 mt-1 border border-emerald-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto" style={{backgroundColor: 'rgb(209 250 229)'}}>
                  {loadingEmployees ? (
                    <div className="p-2 text-center text-sm" style={{color: '#2C373B'}}>Searching...</div>
                  ) : (
                    employees.map((employee) => (
                      <div
                        key={employee._id}
                        className="p-2 cursor-pointer flex items-center gap-2 border-b border-gray-100 last:border-b-0 hover:opacity-80"
                        onClick={() => selectEmployee(employee)}
                        style={{backgroundColor: 'rgb(209 250 229)'}}
                      >
                        <Avatar className="h-6 w-6">
                          {employee.profilePhotoUrl ? (
                            <AvatarImage src={employee.profilePhotoUrl} alt={`${employee.firstName} ${employee.lastName}`} />
                          ) : (
                            <AvatarFallback className="text-xs">
                              {employee.firstName[0]}{employee.lastName[0]}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium text-sm" style={{color: '#2C373B'}}>{employee.firstName} {employee.lastName}</div>
                          <div className="text-xs font-medium" style={{color: '#2C373B'}}>{employee.employeeCode}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Status Filter */}
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:w-[180px] border-emerald-300 bg-emerald-100 text-emerald-700 font-medium hover:bg-emerald-200 h-8" style={{backgroundColor: 'rgb(209 250 229)', color: '#2C373B'}}>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>



        {/* Table */}
        <div className="bg-white rounded-xl shadow-md border overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="min-w-[950px] w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left" style={{fontSize: '12px', fontWeight: 600, color: '#2C373B'}}>
                    Name
                  </th>
                  <th className="px-4 py-3 text-left" style={{fontSize: '12px', fontWeight: 600, color: '#2C373B'}}>
                    Leave Type
                  </th>
                  <th className="px-4 py-3 text-left" style={{fontSize: '12px', fontWeight: 600, color: '#2C373B'}}>
                    Start Date
                  </th>
                  <th className="px-4 py-3 text-left" style={{fontSize: '12px', fontWeight: 600, color: '#2C373B'}}>
                    End Date
                  </th>
                  <th className="px-4 py-3 text-left" style={{fontSize: '12px', fontWeight: 600, color: '#2C373B'}}>
                    Reason
                  </th>
                  <th className="px-4 py-3 text-left" style={{fontSize: '12px', fontWeight: 600, color: '#2C373B'}}>
                    Total Days
                  </th>
                  <th className="px-4 py-3 text-left" style={{fontSize: '12px', fontWeight: 600, color: '#2C373B'}}>
                     Status
                   </th>
                   <th className="px-4 py-3 text-left" style={{fontSize: '12px', fontWeight: 600, color: '#2C373B'}}>
                     Remarks
                   </th>
                   <th className="px-4 py-3 text-left" style={{fontSize: '12px', fontWeight: 600, color: '#2C373B'}}>
                     Actions
                   </th>
                </tr>
              </thead>

              <tbody>
                {filteredRequests.length === 0 && (
                   <tr>
                     <td
                       colSpan={9}
                       className="px-4 py-6 text-center"
                       style={{color: '#2C373B'}}
                     >
                       No leave requests found
                     </td>
                   </tr>
                 )}

                {paginatedRequests.map((req) => (
                  <tr
                    key={req._id}
                    className="border-b last:border-0 hover:bg-emerald-50 transition-colors"
                  >
                    {/* Name with avatar */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {req.employeeId.profilePhotoUrl ? (
                            <AvatarImage
                              src={req.employeeId.profilePhotoUrl}
                              alt={`${req.employeeId.firstName} ${req.employeeId.lastName}`}
                            />
                          ) : (
                            <AvatarFallback>
                              <User className="h-4 w-4 text-gray-500" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span className="font-medium" style={{ fontFamily: 'Montserrat', fontWeight: 500, fontSize: '14px', color: '#2C373B' }}>
                            {`${req.employeeId.firstName} ${req.employeeId.lastName}`}
                          </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 capitalize" style={{ fontFamily: 'Montserrat', fontWeight: 500, fontSize: '14px', color: '#2C373B' }}>{req.leaveType}</td>
                      <td className="px-4 py-3" style={{ fontFamily: 'Montserrat', fontWeight: 500, fontSize: '14px', color: '#2C373B' }}>{formatDate(req.startDate)}</td>
                      <td className="px-4 py-3" style={{ fontFamily: 'Montserrat', fontWeight: 500, fontSize: '14px', color: '#2C373B' }}>{formatDate(req.endDate)}</td>
                      <td className="px-4 py-3" style={{ fontFamily: 'Montserrat', fontWeight: 500, fontSize: '14px', color: '#2C373B' }}>{req.reason}</td>
                      <td className="px-4 py-3" style={{ fontFamily: 'Montserrat', fontWeight: 500, fontSize: '14px', color: '#2C373B' }}>{req.days}</td>

                    {/* Status badge */}
                     <td className="px-4 py-3">
                       {editingRows.has(req._id) ? (
                           <Select
                             value={editValues[req._id]?.status || req.status}
                             onValueChange={(value) => handleEditValueChange(req._id, 'status', value)}
                           >
                             <SelectTrigger className="w-32 h-8" style={{backgroundColor: 'rgb(209 250 229)', color: '#2C373B'}}>
                               <SelectValue />
                             </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="applied">Applied</SelectItem>
                             <SelectItem value="approved">Approved</SelectItem>
                             <SelectItem value="rejected">Rejected</SelectItem>
                             <SelectItem value="cancelled">Cancelled</SelectItem>
                           </SelectContent>
                         </Select>
                       ) : (
                         <span
                           className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(req.status)}`}
                         >
                           {req.status}
                         </span>
                       )}
                     </td>

                     {/* Remarks */}
                       <td className="px-4 py-3" style={{ fontFamily: 'Montserrat', fontWeight: 500, fontSize: '14px', color: '#2C373B' }}>
                         {editingRows.has(req._id) ? (
                           <Input
                             value={editValues[req._id]?.remarks || req.remarks || ''}
                             onChange={(e) => handleEditValueChange(req._id, 'remarks', e.target.value)}
                             placeholder="Enter remarks"
                             className="w-40 h-8 text-xs"
                             style={{backgroundColor: 'rgb(209 250 229)', color: '#2C373B'}}
                           />
                         ) : (
                           req.remarks || "Empty remarks"
                         )}
                       </td>

                     {/* Actions */}
                     <td className="px-4 py-3">
                       {editingRows.has(req._id) ? (
                         <div className="flex gap-2">
                           <Button
                             size="sm"
                             onClick={() => handleUpdate(req._id)}
                             disabled={updating.has(req._id)}
                             style={{backgroundColor: '#4CDC9C', color: '#2C373B'}}
                           >
                             {updating.has(req._id) ? 'Updating...' : 'Update'}
                           </Button>
                           <Button
                             size="sm"
                             variant="outline"
                             onClick={() => handleCancelEdit(req._id)}
                             disabled={updating.has(req._id)}
                             style={{backgroundColor: '#4CDC9C', color: '#2C373B'}}
                           >
                             Cancel
                           </Button>
                         </div>
                       ) : (
                         <Button
                           size="sm"
                           onClick={() => handleEdit(req)}
                           style={{backgroundColor: '#4CDC9C', color: '#2C373B'}}
                         >
                           Edit
                         </Button>
                       )}
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm" style={{color: '#2C373B'}}>
              Showing {startIndex + 1} to {Math.min(endIndex, filteredRequests.length)} of {filteredRequests.length} entries
            </div>
            
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
                style={{backgroundColor: '#4CDC9C', color: '#2C373B'}}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current page
                  const showPage = 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1);
                  
                  if (!showPage) {
                    // Show ellipsis for gaps
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-2" style={{color: '#2C373B'}}>...</span>;
                    }
                    return null;
                  }

                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="min-w-[40px]"
                      style={{backgroundColor: '#4CDC9C', color: '#2C373B'}}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              {/* Next Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
                style={{backgroundColor: '#4CDC9C', color: '#2C373B'}}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Hide scrollbars */}
        <style jsx global>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default LeaveRequests;
