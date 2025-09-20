import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, FileText, Users, Plus } from "lucide-react";

const quickActions = [
  {
    title: "Check In/Out",
    description: "Mark your attendance",
    icon: Clock,
    color: "bg-primary",
    href: "/attendance"
  },
  {
    title: "Request Leave",
    description: "Submit a new leave request",
    icon: Calendar,
    color: "bg-warning",
    href: "/leaves"
  },
  {
    title: "View Payslip",
    description: "Download latest payslip",
    icon: FileText,
    color: "bg-success",
    href: "#"
  },
  {
    title: "Team Directory",
    description: "Browse employee contacts",
    icon: Users,
    color: "bg-accent",
    href: "/employees"
  }
];

export const QuickActions = () => {
  return (
    <Card className="hrms-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full h-auto p-4 justify-start hover:bg-muted/50 transition-colors"
            asChild
          >
            <a href={action.href}>
              <div className={`mr-3 p-2 rounded-lg ${action.color} text-white`}>
                <action.icon className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="font-medium">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </a>
          </Button>
        ))}
        
        <div className="mt-4 pt-3 border-t">
          <Button className="w-full hrms-button-primary">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};