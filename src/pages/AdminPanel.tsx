import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Settings, FileText, Activity, UserPlus, Calendar, Clock } from "lucide-react";

const AdminPanel = () => {
  const adminStats = [
    {
      title: "Total Users",
      value: "243",
      change: "+12",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Pending Approvals",
      value: "15",
      change: "+3",
      icon: Clock,
      color: "text-warning"
    },
    {
      title: "Active Sessions",
      value: "189",
      change: "-2",
      icon: Activity,
      color: "text-success"
    },
    {
      title: "System Health",
      value: "99.9%",
      change: "0%",
      icon: Shield,
      color: "text-primary"
    }
  ];

  const pendingApprovals = [
    { id: 1, employee: "Alice Johnson", type: "Annual Leave", days: "5 days", status: "pending" },
    { id: 2, employee: "Bob Smith", type: "Sick Leave", days: "2 days", status: "pending" },
    { id: 3, employee: "Carol Davis", type: "Personal Leave", days: "1 day", status: "pending" },
  ];

  const recentActivities = [
    { id: 1, action: "New employee added", user: "Jane Doe", time: "2 hours ago" },
    { id: 2, action: "Leave approved", user: "Mike Wilson", time: "4 hours ago" },
    { id: 3, action: "Password reset", user: "Sarah Connor", time: "6 hours ago" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">
            System administration and management dashboard
          </p>
        </div>
        <Badge className="hrms-status-success">
          <Shield className="mr-1 h-3 w-3" />
          Super Admin
        </Badge>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => (
          <Card key={index} className="hrms-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.change.startsWith('+') ? 'text-success' : stat.change.startsWith('-') ? 'text-destructive' : 'text-muted-foreground'}>
                  {stat.change}
                </span>
                {" from last period"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="approvals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="system">System Settings</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="approvals" className="space-y-6">
          <Card className="hrms-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Leave Requests Pending Approval</span>
                <Badge variant="secondary">{pendingApprovals.length} pending</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{approval.employee}</p>
                      <p className="text-sm text-muted-foreground">
                        {approval.type} • {approval.days}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="hrms-button-primary">
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="hrms-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>User Management</span>
                <Button className="hrms-button-primary">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User management interface will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="hrms-card">
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">System settings and configuration options will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="hrms-card">
            <CardHeader>
              <CardTitle>Recent System Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border-l-4 border-primary bg-primary/5 rounded-r">
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">by {activity.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;