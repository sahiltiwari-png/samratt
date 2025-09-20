import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, CheckCircle, XCircle, Clock } from "lucide-react";
import { useState } from "react";

// Mock attendance data
const attendanceData = {
  '2024-12-01': 'present',
  '2024-12-02': 'present',
  '2024-12-03': 'absent', 
  '2024-12-04': 'present',
  '2024-12-05': 'present',
  '2024-12-06': 'weekend',
  '2024-12-07': 'weekend',
  '2024-12-08': 'present',
  '2024-12-09': 'late',
  '2024-12-10': 'present',
  '2024-12-11': 'present',
  '2024-12-12': 'present',
  '2024-12-13': 'weekend',
  '2024-12-14': 'weekend',
  '2024-12-15': 'present',
  '2024-12-16': 'present',
  '2024-12-17': 'today'
};

export const AttendanceCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getAttendanceStatus = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    return attendanceData[dateKey] || null;
  };

  const getDayClassName = (date: Date) => {
    const status = getAttendanceStatus(date);
    const baseClass = "relative";
    
    switch (status) {
      case 'present':
        return `${baseClass} bg-success/20 text-success hover:bg-success/30`;
      case 'absent':
        return `${baseClass} bg-destructive/20 text-destructive hover:bg-destructive/30`;
      case 'late':
        return `${baseClass} bg-warning/20 text-warning hover:bg-warning/30`;
      case 'today':
        return `${baseClass} bg-primary text-primary-foreground hover:bg-primary/90`;
      default:
        return baseClass;
    }
  };

  const attendanceSummary = {
    present: 12,
    absent: 1,
    late: 1,
    totalWorkingDays: 14
  };

  return (
    <Card className="hrms-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          Attendance Calendar
        </CardTitle>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span>Present ({attendanceSummary.present})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-destructive rounded-full"></div>
            <span>Absent ({attendanceSummary.absent})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span>Late ({attendanceSummary.late})</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className="rounded-md border pointer-events-auto"
          modifiers={{
            present: (date) => getAttendanceStatus(date) === 'present',
            absent: (date) => getAttendanceStatus(date) === 'absent',
            late: (date) => getAttendanceStatus(date) === 'late',
            today: (date) => getAttendanceStatus(date) === 'today',
          }}
          modifiersClassNames={{
            present: 'bg-success/20 text-success hover:bg-success/30',
            absent: 'bg-destructive/20 text-destructive hover:bg-destructive/30',
            late: 'bg-warning/20 text-warning hover:bg-warning/30',
            today: 'bg-primary text-primary-foreground hover:bg-primary/90',
          }}
        />
        
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {((attendanceSummary.present / attendanceSummary.totalWorkingDays) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Attendance Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {attendanceSummary.totalWorkingDays}
              </div>
              <div className="text-sm text-muted-foreground">Working Days</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};