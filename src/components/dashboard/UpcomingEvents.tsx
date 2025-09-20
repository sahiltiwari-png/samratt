import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";

const upcomingEvents = [
  {
    id: 1,
    title: "Team Building Event",
    date: "Dec 15, 2024",
    time: "10:00 AM",
    location: "Conference Room A",
    type: "Company Event",
    color: "bg-primary/10 text-primary"
  },
  {
    id: 2,
    title: "Performance Review",
    date: "Dec 18, 2024",
    time: "2:00 PM",
    location: "Manager Office",
    type: "Review",
    color: "bg-warning/10 text-warning"
  },
  {
    id: 3,
    title: "Holiday Party",
    date: "Dec 22, 2024",
    time: "6:00 PM",
    location: "Main Hall",
    type: "Holiday",
    color: "bg-success/10 text-success"
  },
  {
    id: 4,
    title: "Training Session",
    date: "Jan 8, 2025",
    time: "9:00 AM",
    location: "Training Room",
    type: "Training",
    color: "bg-accent/10 text-accent-foreground"
  }
];

const leaveRequests = [
  {
    id: 1,
    employee: "Alice Johnson",
    type: "Annual Leave",
    dates: "Dec 20-22, 2024",
    status: "pending"
  },
  {
    id: 2,
    employee: "Bob Smith",
    type: "Sick Leave",
    dates: "Dec 16-17, 2024",
    status: "approved"
  }
];

export const UpcomingEvents = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Upcoming Events */}
      <Card className="hrms-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/20">
              <div className="flex flex-col items-center text-center min-w-[60px]">
                <Calendar className="h-4 w-4 text-muted-foreground mb-1" />
                <span className="text-xs font-medium">{event.date.split(',')[0]}</span>
                <span className="text-xs text-muted-foreground">{event.date.split(',')[1]}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{event.title}</h4>
                  <Badge variant="outline" className={event.color}>
                    {event.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Leave Requests */}
      <Card className="hrms-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Leave Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {leaveRequests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
              <div>
                <h4 className="font-medium">{request.employee}</h4>
                <p className="text-sm text-muted-foreground">
                  {request.type} • {request.dates}
                </p>
              </div>
              <Badge 
                className={
                  request.status === 'approved' 
                    ? 'hrms-status-success' 
                    : request.status === 'pending'
                    ? 'hrms-status-warning'
                    : 'hrms-status-error'
                }
              >
                {request.status}
              </Badge>
            </div>
          ))}
          
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground text-center">
              <Badge variant="outline">5 pending</Badge> leave requests awaiting approval
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};