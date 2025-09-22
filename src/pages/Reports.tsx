import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, FileText, PieChart, TrendingUp, Users, Calendar } from "lucide-react";

const Reports = () => {
  const reportCategories = [
    {
      title: "Employee Reports",
      icon: Users,
      reports: [
        { name: "Employee Directory", description: "Complete list of all employees", type: "PDF" },
        { name: "Department Wise Report", description: "Employee distribution by department", type: "Excel" },
        { name: "New Hires Report", description: "Recently joined employees", type: "PDF" },
      ]
    },
    {
      title: "Attendance Reports", 
      icon: Calendar,
      reports: [
        { name: "Monthly Attendance", description: "Attendance summary for the month", type: "Excel" },
        { name: "Late Arrivals", description: "Employees with late check-ins", type: "PDF" },
        { name: "Overtime Report", description: "Overtime hours by employee", type: "Excel" },
      ]
    },
    {
      title: "Payroll Reports",
      icon: TrendingUp,
      reports: [
        { name: "Salary Register", description: "Complete salary information", type: "Excel" },
        { name: "Tax Deduction Report", description: "Tax deductions summary", type: "PDF" },
        { name: "Bonus & Incentives", description: "Additional payments report", type: "Excel" },
      ]
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Generate comprehensive reports and insights
          </p>
        </div>
        <Button className="hrms-button-primary">
          <FileText className="mr-2 h-4 w-4" />
          Custom Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hrms-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Available report types
            </p>
          </CardContent>
        </Card>

        <Card className="hrms-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generated Today</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Reports generated today
            </p>
          </CardContent>
        </Card>

        <Card className="hrms-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Reports</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Auto-generated reports
            </p>
          </CardContent>
        </Card>

        <Card className="hrms-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Coverage</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">
              Complete data coverage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report Categories */}
      <div className="space-y-6">
        {reportCategories.map((category, index) => (
          <Card key={index} className="hrms-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <category.icon className="h-5 w-5 text-primary" />
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.reports.map((report, reportIndex) => (
                  <div key={reportIndex} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{report.name}</h4>
                      <Badge variant="outline">{report.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Generate Report
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reports;