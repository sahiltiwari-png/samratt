import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, FileText, TrendingUp, CheckCircle, Plus, Building } from "lucide-react";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { useEffect, useState } from "react";
import { getOrganizations } from "@/api/organizations";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        const data = await getOrganizations();
        setOrganizations(data);
      } catch (err) {
        console.error("Failed to fetch organizations:", err);
        setError("Failed to load organizations");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const stats = [
    {
      title: "Total Employees",
      value: "243",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Present Today",
      value: "189",
      change: "78%",
      icon: CheckCircle,
      color: "text-success"
    },
    {
      title: "Pending Leaves",
      value: "23",
      change: "-5%",
      icon: Calendar,
      color: "text-warning"
    },
    {
      title: "Total Hours",
      value: "1,847",
      change: "+8%",
      icon: Clock,
      color: "text-primary"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your organization's HR metrics
          </p>
        </div>
        <Button className="hrms-button-primary" asChild>
          <Link to="/create-organization">
            <Plus className="mr-2 h-4 w-4" />
            Create Organization
          </Link>
        </Button>
      </div>

      {/* Organizations Section */}
      <Card className="hrms-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Your Organizations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center text-destructive p-4">{error}</div>
          ) : organizations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <Building className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Organizations Found</h3>
              <p className="text-muted-foreground mt-1">
                Create your first organization to get started
              </p>
              <Button className="mt-4 hrms-button-primary" asChild>
                <Link to="/create-organization">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Organization
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {organizations.map((org, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow flex flex-col items-center p-0">
                  {org.logoUrl && (
                    <img src={org.logoUrl} alt={org.name} className="w-full h-32 object-cover rounded-t" />
                  )}
                  <div className="flex-1 w-full flex flex-col items-center p-4">
                    <h3 className="font-bold text-xl text-center mb-4 w-full">{org.name}</h3>
                    <Button variant="outline" className="w-full mt-auto" asChild>
                        <Link to={`/organizations/${org._id}`}>
                          View Details
                        </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
                {" from last month"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Chart */}
        <div className="lg:col-span-2">
          <AttendanceChart />
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Upcoming Events */}
      <UpcomingEvents />
    </div>
  );
};

export default Dashboard;