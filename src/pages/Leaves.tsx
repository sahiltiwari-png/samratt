import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock, CheckCircle, XCircle, Hourglass } from "lucide-react";
import { LeaveRequestForm } from "@/components/leaves/LeaveRequestForm";
import { LeaveHistory } from "@/components/leaves/LeaveHistory";

const Leaves = () => {
  const leaveBalance = {
    annual: { used: 8, total: 25 },
    sick: { used: 3, total: 12 },
    personal: { used: 2, total: 5 }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Leave Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your leave requests and track your balance
          </p>
        </div>
        <Button className="hrms-button-primary">
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hrms-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Annual Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaveBalance.annual.total - leaveBalance.annual.used} days
            </div>
            <p className="text-xs text-muted-foreground">
              {leaveBalance.annual.used} used of {leaveBalance.annual.total} total
            </p>
            <div className="mt-2 w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: `${(leaveBalance.annual.used / leaveBalance.annual.total) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="hrms-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Sick Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaveBalance.sick.total - leaveBalance.sick.used} days
            </div>
            <p className="text-xs text-muted-foreground">
              {leaveBalance.sick.used} used of {leaveBalance.sick.total} total
            </p>
            <div className="mt-2 w-full bg-muted rounded-full h-2">
              <div 
                className="bg-warning h-2 rounded-full" 
                style={{ width: `${(leaveBalance.sick.used / leaveBalance.sick.total) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="hrms-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Personal Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaveBalance.personal.total - leaveBalance.personal.used} days
            </div>
            <p className="text-xs text-muted-foreground">
              {leaveBalance.personal.used} used of {leaveBalance.personal.total} total
            </p>
            <div className="mt-2 w-full bg-muted rounded-full h-2">
              <div 
                className="bg-accent h-2 rounded-full" 
                style={{ width: `${(leaveBalance.personal.used / leaveBalance.personal.total) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Request Form */}
        <div className="lg:col-span-1">
          <LeaveRequestForm />
        </div>

        {/* Leave History */}
        <div className="lg:col-span-2">
          <LeaveHistory />
        </div>
      </div>
    </div>
  );
};

export default Leaves;