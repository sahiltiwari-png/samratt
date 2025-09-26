import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ChevronDown, ChevronRight, User } from 'lucide-react';
import { getEmployeeAttendanceById } from '@/api/attendance';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const EmployeeAttendanceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const employeeName = location.state?.employeeName || 'Aditya Yadav';
  const employeeDesignation = location.state?.employeeDesignation || 'Wordpress developer';
  const profilePhotoUrl = location.state?.profilePhotoUrl;

  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    if (!id) return;
    const fetchAttendanceData = async () => {
      setLoading(true);
      try {
        const params: any = { page: currentPage, limit: 10, status: statusFilter };
        if (dateRange.startDate && dateRange.endDate) {
          params.startDate = format(dateRange.startDate, 'yyyy-MM-dd');
          params.endDate = format(dateRange.endDate, 'yyyy-MM-dd');
        }
        const response = await getEmployeeAttendanceById(id, params);
        if (response && response.attendance) {
          setAttendanceData({ data: [response.attendance], totalPages: 1, currentPage: 1 });
          setError(null);
        } else throw new Error('Invalid response');
      } catch (err) {
        setError('Failed to load attendance data');
        setAttendanceData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendanceData();
  }, [id, currentPage, statusFilter, dateRange]);

  const formatTime = (iso: string | null) => (iso ? format(new Date(iso), 'HH:mm:ss') : '-');

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present':
        return 'bg-emerald-100 text-emerald-700';
      case 'absent':
        return 'bg-red-100 text-red-600';
      case 'half-day':
        return 'bg-yellow-100 text-yellow-700';
      case 'late':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-200 via-emerald-100 to-emerald-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Attendance Record</h1>
        <p className="text-sm text-gray-700 mb-6">
          View daily status, working hours, and clock-in/out for this employee
        </p>

        {/* Employee Info & Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              {profilePhotoUrl ? (
                <AvatarImage src={profilePhotoUrl} alt={employeeName} />
              ) : (
                <AvatarFallback>
                  <User className="h-6 w-6 text-gray-500" />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="text-base font-medium text-gray-900">{employeeName}</h2>
              <p className="text-sm text-gray-500">{employeeDesignation}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-sm border-gray-300 hover:bg-emerald-100 hover:text-emerald-700 focus:border-gray-300 focus:ring-0"
                >
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  Calendar
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{
                    from: dateRange.startDate || undefined,
                    to: dateRange.endDate || undefined,
                  }}
                  onSelect={(range) => {
                    if (range?.from) setDateRange({ startDate: range.from, endDate: range.to || null });
                  }}
                  className="[&_.rdp-day_button:hover:not([disabled])]:bg-emerald-100 [&_.rdp-day_button:hover:not([disabled])]:text-emerald-700 [&_.rdp-day_button:focus:not([disabled])]:bg-emerald-100 [&_.rdp-day_button:focus:not([disabled])]:text-emerald-700 [&_.rdp-day_button.rdp-day_selected]:bg-emerald-600 [&_.rdp-day_button.rdp-day_selected]:text-white [&_.rdp-day_button.rdp-day_selected:hover]:bg-emerald-700"
                />
              </PopoverContent>
            </Popover>

            <Select value={statusFilter || 'all'} onValueChange={(val) => setStatusFilter(val === 'all' ? null : val)}>
              <SelectTrigger className="w-[120px] text-sm border-gray-300 hover:bg-emerald-100 hover:text-emerald-700 focus:border-gray-300 focus:ring-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="[&>*:hover]:bg-emerald-100 [&>*:hover]:text-emerald-700 [&>*.data-[state=checked]]:bg-emerald-100 [&>*.data-[state=checked]]:text-emerald-700">
                <SelectItem value="all" className="data-[highlighted]:bg-emerald-100 data-[highlighted]:text-emerald-700">All</SelectItem>
                <SelectItem value="present" className="data-[highlighted]:bg-emerald-100 data-[highlighted]:text-emerald-700">Present</SelectItem>
                <SelectItem value="absent" className="data-[highlighted]:bg-emerald-100 data-[highlighted]:text-emerald-700">Absent</SelectItem>
                <SelectItem value="half-day" className="data-[highlighted]:bg-emerald-100 data-[highlighted]:text-emerald-700">Half Day</SelectItem>
                <SelectItem value="late" className="data-[highlighted]:bg-emerald-100 data-[highlighted]:text-emerald-700">Late</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="text-sm border-gray-300 hover:bg-emerald-100 hover:text-emerald-700 focus:border-gray-300 focus:ring-0"
              onClick={() => {
                setStatusFilter(null);
                setDateRange({ startDate: null, endDate: null });
              }}
            >
              Clear filters
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Date</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Clock In</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Clock Out</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Working Hours</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Marked By</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData?.data?.map((rec: any) => (
                <tr key={rec._id} className="border-b last:border-0">
                  <td className="px-4 py-2">{format(new Date(rec.date), 'dd/MM/yyyy')}</td>
                  <td className="px-4 py-2">
                    <Badge className={`${getStatusColor(rec.status)} capitalize`}>{rec.status}</Badge>
                  </td>
                  <td className="px-4 py-2">{formatTime(rec.clockIn)}</td>
                  <td className="px-4 py-2">{formatTime(rec.clockOut)}</td>
                  <td className="px-4 py-2">{rec.totalWorkingHours || '-'}</td>
                  <td className="px-4 py-2">{rec.markedBy}</td>
                  <td className="px-4 py-2 text-blue-600 cursor-pointer">Edit</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between p-3 border-t bg-white">
            <span className="text-sm text-gray-600">Prev</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((p) => (
                <Button
                  key={p}
                  size="sm"
                  variant={p === currentPage ? 'default' : 'outline'}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
            <span className="flex items-center text-sm text-gray-600">Next <ChevronRight className="h-4 w-4 ml-1" /></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendanceDetail;