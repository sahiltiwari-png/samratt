import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ChevronLeft, ChevronRight, ChevronDown, User } from 'lucide-react';
import { getEmployeeAttendanceById } from '@/api/attendance';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';

interface Employee {
  id: string;
  name: string;
  position: string;
  profilePhotoUrl?: string;
}

interface AttendanceRecord {
  id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  clockIn: string | null;
  clockOut: string | null;
  workingHours: string | null;
  markedBy: string;
  employee: Employee;
}

interface AttendanceResponse {
  data: AttendanceRecord[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

const EmployeeAttendanceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [attendanceData, setAttendanceData] = useState<AttendanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null
  });

  // Fetch attendance data
  useEffect(() => {
    if (!id) return;

    const fetchAttendanceData = async () => {
      setLoading(true);
      try {
        // Prepare API parameters
        const params: any = {
          page: currentPage,
          limit: 10,
          status: statusFilter
        };
        
        // Use date range if available
        if (dateRange.startDate && dateRange.endDate) {
          params.startDate = format(dateRange.startDate, 'yyyy-MM-dd');
          params.endDate = format(dateRange.endDate, 'yyyy-MM-dd');
        }
        
        const response = await getEmployeeAttendanceById(id, params);
        
        if (response && response.attendance) {
          // Create a formatted record from the attendance data
          const formattedRecord: AttendanceRecord = {
            id: response.attendance._id,
            date: response.attendance.date,
            status: response.attendance.status,
            clockIn: response.attendance.clockIn,
            clockOut: response.attendance.clockOut,
            workingHours: response.attendance.totalWorkingHours,
            markedBy: response.attendance.markedBy,
            employee: {
              id: response.attendance.employeeId,
              name: 'Employee', // This will be updated if we have employee details
              position: 'Position'
            }
          };
          
          // Create a mock response structure that matches the component's expected format
          const formattedData: AttendanceResponse = {
            data: [formattedRecord],
            totalPages: 1,
            currentPage: 1,
            totalItems: 1
          };
          
          setAttendanceData(formattedData);
          setError(null);
          
          // For debugging
          console.log("Successfully loaded attendance data:", response);
        } else {
          console.error("Invalid response format:", response);
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Failed to fetch attendance data:", err);
        setError("Failed to load attendance data");
        setAttendanceData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [id, currentPage, statusFilter, dateRange]);

  // Format time from ISO string
  const formatTime = (isoString: string | null) => {
    if (!isoString) return "-";
    return format(new Date(isoString), "h:mm a");
  };

  // Handle date range selection
  const handleDateRangeChange = (range: { startDate: Date | null; endDate: Date | null }) => {
    setDateRange(range);
    setCurrentPage(1); // Reset to first page
  };

  // Handle status change
  const handleStatusChange = (value: string) => {
    setStatusFilter(value === "all" ? null : value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setStatusFilter(null);
    setDateRange({ startDate: null, endDate: null });
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'half-day':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Update pagination style

  return (
    <div className="p-4 md:p-6 bg-green-200 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-4 md:p-6">
        <Button 
          variant="ghost" 
          className="mb-4 flex items-center text-gray-600 hover:text-teal-600"
          onClick={() => navigate('/attendance')}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Attendance
        </Button>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Attendance Record</h1>
          <p className="text-gray-600">View daily status, working hours, and clock-in/out for this employee</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6 bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              {employee?.profilePhotoUrl ? (
                <AvatarImage src={employee.profilePhotoUrl} alt={employee?.name || 'Employee'} />
              ) : (
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">Aditya Yadav</h2>
              <p className="text-gray-500">Wordpress developer</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto flex items-center justify-between hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.startDate && dateRange.endDate ? (
                    <span>
                      {format(dateRange.startDate, 'MMM dd, yyyy')} - {format(dateRange.endDate, 'MMM dd, yyyy')}
                    </span>
                  ) : (
                    <span>Calendar</span>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-2">
                  <div className="flex justify-between px-2 mb-2 text-xs">
                    <div>
                      <div className="font-medium">Start:</div>
                      <div>{dateRange.startDate ? format(dateRange.startDate, 'MMM dd, yyyy') : 'Select'}</div>
                    </div>
                    <div>
                      <div className="font-medium">End:</div>
                      <div>{dateRange.endDate ? format(dateRange.endDate, 'MMM dd, yyyy') : 'Select'}</div>
                    </div>
                  </div>
                  <Calendar
                    mode="range"
                    selected={{
                      from: dateRange.startDate || undefined,
                      to: dateRange.endDate || undefined
                    }}
                    onSelect={(range) => {
                      if (range?.from) {
                        handleDateRangeChange({ 
                          startDate: range.from, 
                          endDate: range.to || null 
                        });
                        if (range.to) setIsCalendarOpen(false);
                      }
                    }}
                    initialFocus
                  />
                </div>
              </PopoverContent>
            </Popover>

            <Select value={statusFilter || "all"} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full sm:w-[180px] hover:border-teal-200 hover:text-teal-600">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="half-day">Half Day</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              className="w-full sm:w-auto px-4 py-2 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200"
              onClick={handleClearFilters}
            >
              Clear filters
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setError(null);
                setCurrentPage(1);
                setStatusFilter(null);
                setDateRange({ startDate: null, endDate: null });
              }}
            >
              Try Again
            </Button>
          </div>
        ) : attendanceData && attendanceData.data && attendanceData.data.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clock In
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clock Out
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Working Hours
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marked By
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceData.data.map((record) => (
                    <tr key={record.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(record.date), 'MM/dd/yyyy')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge className={`${getStatusColor(record.status)} capitalize`}>
                          {record.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTime(record.clockIn)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTime(record.clockOut)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.workingHours || '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.markedBy}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-500">
                        <Button 
                          variant="ghost" 
                          className="text-blue-500 hover:text-teal-600 hover:bg-transparent"
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {attendanceData.totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <span className="sr-only">Previous page</span>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].slice(0, Math.min(10, attendanceData.totalPages)).map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="icon"
                        className={`h-8 w-8 ${page === currentPage ? 'bg-teal-500 hover:bg-teal-600' : 'hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200'}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200"
                    disabled={currentPage === attendanceData.totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <span className="sr-only">Next page</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-gray-50 p-8 text-center rounded-md">
            <p className="text-gray-500">No attendance records found for this employee.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeAttendanceDetail;