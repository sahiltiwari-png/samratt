import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ChevronLeft, ChevronRight, User } from 'lucide-react';
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
        // Only add parameters if they are actually set
        const params: any = {};
        
        // Only add page and limit by default
        params.page = currentPage;
        params.limit = 10;
        
        // Only add status filter if it's set
        if (statusFilter) {
          params.status = statusFilter;
        }
        
        // Only add date range if both dates are set
        if (dateRange.startDate && dateRange.endDate) {
          params.startDate = format(dateRange.startDate, 'yyyy-MM-dd');
          params.endDate = format(dateRange.endDate, 'yyyy-MM-dd');
        }
        
        const data = await getEmployeeAttendanceById(id, params);
        setAttendanceData(data);
        
        // Set employee data from the first record if available
        if (data.data.length > 0 && !employee) {
          setEmployee(data.data[0].employee);
        }
        
        setError(null);
      } catch (err) {
        console.error("Failed to fetch attendance data:", err);
        setError("Failed to load attendance data");
        setAttendanceData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [id, currentPage, statusFilter, dateRange, employee]);

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

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-green-50 to-teal-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-4 md:p-6">
        <Button 
          variant="ghost" 
          className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
          onClick={() => navigate('/attendance')}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Attendance
        </Button>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
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
              <h1 className="text-2xl font-bold">{employee?.name || 'Employee'}</h1>
              <p className="text-gray-500">{employee?.position || 'Position'}</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Attendance Record</h2>
        <p className="text-gray-600 mb-6">View daily status, working hours, and clock-in/out for this employee</p>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto flex items-center justify-between"
                >
                  {dateRange.startDate && dateRange.endDate ? (
                    <span>
                      {format(dateRange.startDate, 'MMM dd, yyyy')} - {format(dateRange.endDate, 'MMM dd, yyyy')}
                    </span>
                  ) : (
                    <span>Select date range</span>
                  )}
                  <CalendarIcon className="ml-2 h-4 w-4" />
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
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
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
              className="w-full sm:w-auto px-4 py-2"
              onClick={handleClearFilters}
            >
              Clear filters
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-800 p-4 rounded-md">
            {error}
          </div>
        ) : attendanceData && attendanceData.data.length > 0 ? (
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
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Clock In
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Clock Out
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Working Hours
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marked By
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
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                        {formatTime(record.clockIn)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                        {formatTime(record.clockOut)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.workingHours || '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.markedBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {attendanceData.totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination
                  currentPage={attendanceData.currentPage}
                  totalPages={attendanceData.totalPages}
                  onPageChange={handlePageChange}
                />
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