import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Building, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const HR = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for organizations
  const organizations = [
    {
      id: 1,
      name: "GoUnicrew",
      employees: 250,
      hrs: 10,
      status: "Active",
      payrollProcessed: 124,
    },
    {
      id: 2,
      name: "GoUnicrew",
      employees: 250,
      hrs: 10,
      status: "Active",
      payrollProcessed: 124,
    },
  ];

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-primary/10 to-primary/5">
      {/* Header with Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Create and Manage all organizations in one place</h1>
        </div>
        
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search HRs by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org) => (
          <Card key={org.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-center mb-4">
                <img 
                  src="/src/assets/gounicrew-logo.png" 
                  alt="GoUnicrew"
                  className="h-16 w-auto"
                />
              </div>
              <div className="text-center space-y-2">
                <div className="flex justify-center space-x-2 text-sm text-gray-600">
                  <span>{org.hrs} HRs</span>
                  <span>•</span>
                  <span>{org.employees} Employees</span>
                </div>
                <div className="flex justify-center space-x-4 text-xs">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                    Payroll
                  </span>
                  <span className="text-gray-500">{org.payrollProcessed} Processed</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
        
        {/* Create New Organization Card */}
        <Card className="border-2 border-dashed border-gray-300 hover:border-primary/50 transition-colors">
          <CardContent className="flex flex-col items-center justify-center h-full py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Create New Organization</h3>
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              Create Organization
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HR;