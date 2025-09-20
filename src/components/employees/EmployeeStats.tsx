import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Building } from "lucide-react";

const stats = [
  {
    title: "Total Employees",
    value: "243",
    change: "+12",
    icon: Users,
    color: "text-primary"
  },
  {
    title: "Active Today",
    value: "189",
    change: "+5",
    icon: UserCheck,
    color: "text-success"
  },
  {
    title: "On Leave",
    value: "8",
    change: "-2",
    icon: UserX,
    color: "text-warning"
  },
  {
    title: "Departments",
    value: "12",
    change: "+1",
    icon: Building,
    color: "text-accent-foreground"
  }
];

const departments = [
  { name: "Engineering", count: 89, percentage: 37 },
  { name: "Sales", count: 45, percentage: 19 },
  { name: "Marketing", count: 32, percentage: 13 },
  { name: "Support", count: 28, percentage: 12 },
  { name: "Design", count: 21, percentage: 9 },
  { name: "HR", count: 15, percentage: 6 },
  { name: "Finance", count: 13, percentage: 5 }
];

export const EmployeeStats = () => {
  return (
    <div className="space-y-6">
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
                <span className={stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}>
                  {stat.change}
                </span>
                {" from last month"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Department Breakdown */}
      <Card className="hrms-card">
        <CardHeader>
          <CardTitle>Department Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {departments.map((dept, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{dept.name}</span>
                    <span className="text-sm text-muted-foreground">{dept.count} employees</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${dept.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm font-medium text-muted-foreground w-12 text-right">
                  {dept.percentage}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};