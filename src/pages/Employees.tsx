import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, Users, Mail, Phone } from "lucide-react";
import { EmployeeList } from "@/components/employees/EmployeeList";
import { EmployeeStats } from "@/components/employees/EmployeeStats";

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Employees</h1>
          <p className="text-muted-foreground mt-1">
            Manage your organization's workforce
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button className="hrms-button-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Stats */}
      <EmployeeStats />

      {/* Search and Filters */}
      <Card className="hrms-card">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Department</Button>
            <Button variant="outline">Position</Button>
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <EmployeeList searchTerm={searchTerm} />
    </div>
  );
};

export default Employees;