import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter, Eye, Pencil, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { getAttendance } from "@/api/attendance";

interface Employee {
  _id: string;
  name: string;
  employeeCode: string;
  designation: string;
  profilePhotoUrl?: string;
}

interface AttendanceRecord {
  _id: string;
  employee: Employee;
  status: string;
  clockIn: string | null;
  clockOut: string | null;
  totalWorkingHours: number | null;
  date: string;
}

interface AttendanceResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: AttendanceRecord[];
}

const Attendance = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [attendanceData, setAttendanceData] = useState<AttendanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendanceData = async () => {
      setLoading(true);
      try {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const data = await getAttendance({
          page: currentPage,
          limit: 10,
          status: statusFilter,
          date: formattedDate
        });
        setAttendanceData(data);
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
  }, [currentPage, statusFilter, date]);

  // Function to get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "absent":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "half day":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  // Format time from ISO string
  const formatTime = (timeString: string | null) => {
    if (!timeString) return "-";
    try {
      return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "-";
    }
  };

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    setStatusFilter(value === "all" ? null : value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setStatusFilter(null);
    setDate(new Date());
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 overflow-x-hidden min-h-screen">
      <Card className="shadow-md rounded-xl">
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pt-4">
            <h2 className="text-xl font-medium">Today's Employees Attendance</h2>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1 text-xs h-7 px-2 bg-green-50 border-green-100">
                    <CalendarIcon className="h-3 w-3" />
                    <span>Calendar</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                      if (date) {
                        setDate(date);
                        setIsCalendarOpen(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Select value={statusFilter || "all"} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[100px] text-xs h-7 bg-gray-50 border-gray-100">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">All</SelectItem>
                  <SelectItem value="present" className="text-xs">Present</SelectItem>
                  <SelectItem value="absent" className="text-xs">Absent</SelectItem>
                  <SelectItem value="half-day" className="text-xs">Half Day</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                className="text-gray-500 text-xs h-7 px-2 border-gray-200 bg-white hover:text-green-600 hover:border-green-300 mt-2 md:mt-0"
                onClick={handleClearFilters}
              >
                Clear filters
              </Button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="rounded-lg border bg-white overflow-x-auto max-h-[500px] overflow-y-auto mx-auto w-full" style={{ touchAction: 'pan-y' }}>
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <p>Loading attendance data...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center p-8 text-red-500">
                <p>{error}</p>
              </div>
            ) : attendanceData && attendanceData.items.length > 0 ? (
              <table className="w-full text-sm border-separate border-spacing-0" style={{ borderRadius: '12px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', tableLayout: 'auto' }}>
                <colgroup className="md:table-column-group">
                  <col className="w-[40%] md:w-[30%]" />
                  <col className="w-[20%] md:w-[20%]" />
                  <col className="hidden md:table-column w-[20%]" />
                  <col className="hidden md:table-column w-[20%]" />
                  <col className="w-[40%] md:w-[10%]" />
                </colgroup>
                <thead>
                  <tr className="text-gray-700 font-semibold border-b bg-gradient-to-r from-green-50 to-white">
                    <th className="px-3 py-3 text-left rounded-tl-lg">Name</th>
                    <th className="px-3 py-3 text-left">Status</th>
                    <th className="px-3 py-3 text-left hidden md:table-cell">ClockIn</th>
                    <th className="px-3 py-3 text-left hidden md:table-cell">Clockout</th>
                    <th className="px-3 py-3 text-left rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.items.map((record) => (
                    <tr key={record._id} className="border-b last:border-b-0 hover:bg-green-50 transition-colors">
                      <td className="px-3 py-3 max-w-xs truncate align-middle">
                        <div className="flex flex-row items-center gap-2 md:gap-3 w-full">
                          <Avatar className="h-8 w-8 md:h-10 md:w-10">
                            {record.employee.profilePhotoUrl ? (
                              <AvatarImage src={record.employee.profilePhotoUrl} alt={record.employee.name} />
                            ) : (
                              <AvatarFallback>
                                <User className="h-4 w-4 md:h-5 md:w-5" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="truncate flex-col">
                            <div className="font-medium text-gray-900 leading-tight text-xs md:text-sm truncate">{record.employee.name}</div>
                            <div className="text-xs md:text-sm text-gray-500">{record.employee.designation}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 align-middle">
                        <Badge className={cn("font-normal text-xs md:text-sm", getStatusBadgeClass(record.status))}>
                          {record.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 align-middle text-sm hidden md:table-cell">{formatTime(record.clockIn)}</td>
                      <td className="px-3 py-3 align-middle text-sm hidden md:table-cell">{formatTime(record.clockOut)}</td>
                      <td className="px-3 py-3 align-middle">
                        <div className="flex space-x-1">
                          <Button variant="link" size="icon" className="text-blue-600 h-8 w-8 p-0">
                            <Eye className="w-4 h-4 md:w-5 md:h-5" />
                          </Button>
                          <Button variant="link" size="icon" className="text-green-600 h-8 w-8 p-0">
                            <Pencil className="w-4 h-4 md:w-5 md:h-5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex justify-center items-center p-8">
                <p>No attendance records found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {attendanceData && attendanceData.totalPages > 1 && (
            <div className="flex items-center justify-center mt-6 text-sm">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm h-9 px-3"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Prev
              </Button>
              
              <div className="flex items-center">
                {Array.from({ length: Math.min(3, attendanceData.totalPages) }, (_, i) => {
                  // Show pages around current page
                  let pageToShow = currentPage;
                  if (currentPage === 1) {
                    pageToShow = i + 1;
                  } else if (currentPage === attendanceData.totalPages) {
                    pageToShow = attendanceData.totalPages - 2 + i;
                  } else {
                    pageToShow = currentPage - 1 + i;
                  }
                  
                  // Ensure page is within valid range
                  if (pageToShow > 0 && pageToShow <= attendanceData.totalPages) {
                    return (
                      <Button 
                        key={pageToShow}
                        variant={pageToShow === currentPage ? "default" : "ghost"} 
                        size="sm" 
                        className="mx-1 h-9 w-9 p-0 text-sm"
                        onClick={() => handlePageChange(pageToShow)}
                      >
                        {pageToShow}
                      </Button>
                    );
                  }
                  return null;
                })}
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm h-9 px-3"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === attendanceData.totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;