import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Play, Square, Coffee, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

interface TimeTrackerProps {
  stats: {
    checkIn: string;
    checkOut: string;
    totalHours: string;
    breakTime: string;
    status: string;
  };
}

export const TimeTracker = ({ stats }: TimeTrackerProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnBreak, setIsOnBreak] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isCheckedIn = stats.checkIn !== "--";
  const isCheckedOut = stats.checkOut !== "--";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Clock Card */}
      <Card className="hrms-card lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Current Time
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-4xl font-bold mb-2">
            {currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
          <div className="text-muted-foreground">
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 justify-center">
            {!isCheckedIn ? (
              <Button className="hrms-button-primary flex-1 max-w-[150px]">
                <Play className="mr-2 h-4 w-4" />
                Check In
              </Button>
            ) : !isCheckedOut ? (
              <>
                <Button
                  variant={isOnBreak ? "destructive" : "outline"}
                  onClick={() => setIsOnBreak(!isOnBreak)}
                  className="flex-1 max-w-[120px]"
                >
                  <Coffee className="mr-2 h-4 w-4" />
                  {isOnBreak ? "End Break" : "Break"}
                </Button>
                <Button className="hrms-button-primary flex-1 max-w-[120px]">
                  <Square className="mr-2 h-4 w-4" />
                  Check Out
                </Button>
              </>
            ) : (
              <div className="text-success font-medium">
                Work day completed! 🎉
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="hrms-card">
        <CardHeader>
          <CardTitle className="text-base">Today's Hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{stats.totalHours}</div>
            <div className="text-sm text-muted-foreground">Total Time</div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check In:</span>
              <span className="font-medium">{stats.checkIn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expected:</span>
              <span className="font-medium">8h 0m</span>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all" 
              style={{ width: '92%' }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Status Card */}
      <Card className="hrms-card">
        <CardHeader>
          <CardTitle className="text-base">Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isOnBreak 
              ? 'bg-warning/10 text-warning' 
              : isCheckedIn && !isCheckedOut 
                ? 'bg-success/10 text-success'
                : 'bg-muted text-muted-foreground'
          }`}>
            {isOnBreak ? 'On Break' : isCheckedIn && !isCheckedOut ? 'Working' : 'Not Checked In'}
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Office Location</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Break Time:</span>
              <span className="font-medium">{stats.breakTime}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};