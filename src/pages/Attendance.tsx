import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, CheckCircle, XCircle, Coffee } from "lucide-react";
import { AttendanceCalendar } from "@/components/attendance/AttendanceCalendar";
import { TimeTracker } from "@/components/attendance/TimeTracker";

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const todayStats = {
    checkIn: "09:15 AM",
    checkOut: "--",
    totalHours: "7h 23m",
    breakTime: "45m",
    status: "Present"
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Attendance</h1>
          <p className="text-muted-foreground mt-1">
            Track your daily attendance and working hours
          </p>
        </div>
        <Badge className="hrms-status-success">
          <CheckCircle className="mr-1 h-3 w-3" />
          {todayStats.status}
        </Badge>
      </div>

      {/* Time Tracker */}
      <TimeTracker stats={todayStats} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Calendar */}
        <div className="lg:col-span-2">
          <AttendanceCalendar />
        </div>

        {/* Today's Summary */}
        <Card className="hrms-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Today's Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Check In</span>
              <span className="font-medium">{todayStats.checkIn}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Check Out</span>
              <span className="font-medium">{todayStats.checkOut}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Hours</span>
              <span className="font-medium text-primary">{todayStats.totalHours}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Break Time</span>
              <span className="font-medium">{todayStats.breakTime}</span>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Location</span>
              </div>
              <p className="text-sm">Office - Downtown Branch</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Attendance;