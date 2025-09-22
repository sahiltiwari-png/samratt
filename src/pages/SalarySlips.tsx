import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Filter, FileText, Calendar } from "lucide-react";

const SalarySlips = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Salary Slips</h1>
          <p className="text-muted-foreground mt-1">
            Generate and manage employee salary slips
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button className="hrms-button-primary">
            <FileText className="mr-2 h-4 w-4" />
            Generate Slip
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="hrms-card">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search salary slips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Month</Button>
            <Button variant="outline">Department</Button>
          </div>
        </CardContent>
      </Card>

      {/* Salary Slips List */}
      <Card className="hrms-card">
        <CardHeader>
          <CardTitle>Salary Slips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">John Doe - March 2024</p>
                    <p className="text-sm text-muted-foreground">Software Engineer • Engineering</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">$5,200</p>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Generated on Mar 31, 2024
                    </p>
                  </div>
                  <Badge variant="secondary" className="hrms-status-success">
                    Generated
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalarySlips;