import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Download, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getAttendanceReportAll, type AttendanceReportItem } from '@/api/attendance';

// Helpers
const sanitizePhotoUrl = (url?: string) => {
  if (!url) return undefined;
  return url.replace(/[`'\"]/g, '').trim();
};

const normalizeStatus = (status?: string) => {
  if (!status) return 'Unknown';
  const s = status.toLowerCase();
  if (s === 'present') return 'Present';
  if (s === 'absent') return 'Absent';
  if (s === 'leave') return 'Leave';
  if (s === 'wfh') return 'WFH';
  if (s === 'late') return 'Late';
  return status;
};

const formatTime = (iso?: string | null) => {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '-';
  }
};

const AttendanceReport = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const statusOptions = ['All Status', 'Present', 'Absent', 'Leave', 'WFH', 'Late'];

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (startDate) params.startDate = format(startDate, 'yyyy-MM-dd');
        if (endDate) params.endDate = format(endDate, 'yyyy-MM-dd');
        if (statusFilter && statusFilter.toLowerCase() !== 'all status') {
          params.status = statusFilter.toLowerCase();
        }
        const res = await getAttendanceReportAll(params);
        setAttendanceData(res.data || []);
        setCurrentPage(1);
      } catch (e) {
        setAttendanceData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [startDate, endDate, statusFilter]);

  const totalPages = Math.ceil(attendanceData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAttendanceData = attendanceData.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const getStatusBadgeColor = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case 'present':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-300';
      case 'absent':
        return 'bg-red-100 text-red-800 border border-red-300';
      case 'leave':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'wfh':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'late':
        return 'bg-orange-100 text-orange-800 border border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  const handleExportReport = () => {
    // Dummy export action
    const blob = new Blob([JSON.stringify(attendanceData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance-report.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden flex flex-col"
      style={{
        background:
          'linear-gradient(151.95deg, rgba(76, 220, 156, 0.81) 17.38%, rgba(255, 255, 255, 0.81) 107.36%)',
      }}
    >
      <div className="flex-1 overflow-x-hidden">
        <div className="w-full max-w-none space-y-6 px-1 py-4 md:px-6 md:py-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Attendance Report</h1>
              <p className="text-gray-600 font-medium" style={{ fontWeight: '500' }}>
                View and manage attendance information
              </p>
            </div>
            <Button
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
              onClick={handleExportReport}
              style={{
                backgroundColor: '#4CDC9C',
                color: '#2C373B',
                fontSize: '14px',
                fontWeight: '600',
                border: 'none',
              }}
            >
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 items-end">
                {/* Start Date */}
                <div className="space-y-2">
                  <Label className="text-emerald-800 font-medium">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal bg-emerald-100 border-emerald-300 text-emerald-700 hover:bg-emerald-200 h-9',
                          !startDate && 'text-emerald-600'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-emerald-600" />
                        {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label className="text-emerald-800 font-medium">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal bg-emerald-100 border-emerald-300 text-emerald-700 hover:bg-emerald-200 h-9',
                          !endDate && 'text-emerald-600'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-emerald-600" />
                        {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <Label className="text-emerald-800 font-medium">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-emerald-100 border-emerald-300 text-emerald-700 hover:bg-emerald-200 h-9">
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

                {/* Clear All Filters Button */}
                <div className="space-y-2">
                  <Label className="text-transparent">Action</Label>
                  <Button
                    variant="outline"
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-100 h-9"
                    onClick={() => {
                      setStartDate(undefined);
                      setEndDate(undefined);
                      setStatusFilter('All Status');
                      setCurrentPage(1);
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading attendance data...</p>
                </div>
              ) : (
                <>
                  {/* Mobile View - Enhanced Card Layout */}
                  <div className="lg:hidden">
                    <div className="p-1 border-b border-emerald-200 bg-emerald-50">
                      <p className="text-xs text-emerald-700 font-medium">
                        Showing {attendanceData.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, attendanceData.length)} of {attendanceData.length} records
                      </p>
                    </div>
                    {attendanceData.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <p className="font-medium">No attendance data found</p>
                        <p className="text-sm mt-1">Try adjusting your filters</p>
                      </div>
                    ) : (
                      <div className="p-1 space-y-3">
                        {currentAttendanceData.map((item, index) => (
                          <div key={`${item.employeeCode}-${index}`} className="bg-white rounded-lg border border-emerald-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="p-4 space-y-4">
                              {/* Employee Info Header */}
                              <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12 border-2 border-emerald-200">
                                  {item.profilePhotoUrl ? (
                                    <AvatarImage src={sanitizePhotoUrl(item.profilePhotoUrl)} alt={item.employeeName} />
                                  ) : (
                                    <AvatarFallback className="bg-emerald-100">
                                      <User className="h-6 w-6 text-emerald-600" />
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="font-bold text-emerald-900 text-base truncate">{item.employeeName}</div>
                                  <div className="text-emerald-700 text-sm truncate">{item.employeeCode} • {item.designation}</div>
                                </div>
                              </div>

                              {/* Attendance Details */}
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-emerald-700 font-semibold" style={{fontSize: '14px', fontWeight: '600'}}>Date:</span>
                                  <span className="font-medium text-emerald-900">{format(new Date(item.date), 'PPP')}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-emerald-700 font-semibold" style={{fontSize: '14px', fontWeight: '600'}}>Status:</span>
                                  <Badge className={getStatusBadgeColor(item.status)}>{normalizeStatus(item.status)}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-emerald-700 font-semibold" style={{fontSize: '14px', fontWeight: '600'}}>Check-In:</span>
                                  <span className="font-medium text-emerald-900">{formatTime(item.clockIn)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-emerald-700 font-semibold" style={{fontSize: '14px', fontWeight: '600'}}>Check-Out:</span>
                                  <span className="font-medium text-emerald-900">{formatTime(item.clockOut)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-emerald-700 font-semibold" style={{fontSize: '14px', fontWeight: '600'}}>Total Hours:</span>
                                  <span className="font-medium text-emerald-900">{item.totalWorkingHours || '-'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Desktop View */}
                  <div className="hidden lg:block">
                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-emerald-100" style={{ WebkitOverflowScrolling: 'touch' }}>
                      <table className="w-full min-w-[800px] divide-y divide-gray-200">
                        <thead className="border-b" style={{ background: '#2C373B', color: '#FFFFFF' }}>
                          <tr>
                            <th className="px-3 py-3 text-left text-sm font-semibold w-[200px] whitespace-nowrap" style={{ fontSize: '12px', fontWeight: 600, lineHeight: '18px', color: '#FFFFFF' }}>
                              Name
                            </th>
                            <th className="px-3 py-3 text-left text-sm font-semibold w-[120px] whitespace-nowrap" style={{ fontSize: '12px', fontWeight: 600, lineHeight: '18px', color: '#FFFFFF' }}>
                              Code
                            </th>
                            <th className="px-3 py-3 text-left text-sm font-semibold w-[160px] whitespace-nowrap" style={{ fontSize: '12px', fontWeight: 600, lineHeight: '18px', color: '#FFFFFF' }}>
                              Designation
                            </th>
                            <th className="px-3 py-3 text-left text-sm font-semibold w-[160px] whitespace-nowrap" style={{ fontSize: '12px', fontWeight: 600, lineHeight: '18px', color: '#FFFFFF' }}>
                              Date
                            </th>
                            <th className="px-3 py-3 text-center text-sm font-semibold w-[100px] whitespace-nowrap" style={{ fontSize: '12px', fontWeight: 600, lineHeight: '18px', color: '#FFFFFF' }}>
                              Status
                            </th>
                            <th className="px-3 py-3 text-center text-sm font-semibold w-[100px] whitespace-nowrap" style={{ fontSize: '12px', fontWeight: 600, lineHeight: '18px', color: '#FFFFFF' }}>
                              Check-In
                            </th>
                            <th className="px-3 py-3 text-center text-sm font-semibold w-[100px] whitespace-nowrap" style={{ fontSize: '12px', fontWeight: 600, lineHeight: '18px', color: '#FFFFFF' }}>
                              Check-Out
                            </th>
                            <th className="px-3 py-3 text-center text-sm font-semibold w-[120px] whitespace-nowrap" style={{ fontSize: '12px', fontWeight: 600, lineHeight: '18px', color: '#FFFFFF' }}>
                              Total Hours
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-emerald-100">
                          {attendanceData.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="px-3 py-8 text-center text-gray-500">
                                <p>No attendance data found</p>
                                <p className="text-sm mt-1">Try adjusting your filters</p>
                              </td>
                            </tr>
                          ) : (
                            currentAttendanceData.map((item, index) => (
                              <tr key={`${item.employeeCode}-${index}`}>
                                <td className="px-3 py-3">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9 border-2 border-emerald-200">
                                      {item.profilePhotoUrl ? (
                                        <AvatarImage src={sanitizePhotoUrl(item.profilePhotoUrl)} alt={item.employeeName} />
                                      ) : (
                                        <AvatarFallback className="bg-emerald-100">
                                          <User className="h-5 w-5 text-emerald-600" />
                                        </AvatarFallback>
                                      )}
                                    </Avatar>
                                    <div>
                                      <div className="font-medium text-emerald-900">{item.employeeName}</div>
                                      <div className="text-emerald-700 text-sm">{item.employeeCode}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 py-3">{item.employeeCode}</td>
                                <td className="px-3 py-3">{item.designation}</td>
                                <td className="px-3 py-3">{format(new Date(item.date), 'PPP')}</td>
                                <td className="px-3 py-3 text-center">
                                  <Badge className={getStatusBadgeColor(item.status)}>{normalizeStatus(item.status)}</Badge>
                                </td>
                                <td className="px-3 py-3 text-center">{formatTime(item.clockIn)}</td>
                                <td className="px-3 py-3 text-center">{formatTime(item.clockOut)}</td>
                                <td className="px-3 py-3 text-center">{item.totalWorkingHours || '-'}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="bg-emerald-50 px-4 py-3 border-t border-emerald-200 sm:px-6">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-emerald-700">
                          Showing {startIndex + 1} to {Math.min(endIndex, attendanceData.length)} of {attendanceData.length} results
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Previous</span>
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
                                  variant={currentPage === pageNum ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => goToPage(pageNum)}
                                  className={`w-8 h-8 p-0 ${
                                    currentPage === pageNum
                                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                      : 'border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                                  }`}
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
                            className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                          >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;