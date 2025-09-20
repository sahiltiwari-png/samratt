import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, Eye, Calendar, Clock } from "lucide-react";

const leaveHistory = [
  {
    id: 1,
    type: "Annual Leave",
    startDate: "Dec 20, 2024",
    endDate: "Dec 22, 2024",
    days: 3,
    status: "approved",
    reason: "Family vacation",
    appliedDate: "Dec 10, 2024",
    approvedBy: "Jane Smith"
  },
  {
    id: 2,
    type: "Sick Leave",
    startDate: "Nov 15, 2024",
    endDate: "Nov 16, 2024",
    days: 2,
    status: "approved",
    reason: "Medical appointment",
    appliedDate: "Nov 14, 2024",
    approvedBy: "Jane Smith"
  },
  {
    id: 3,
    type: "Personal Leave",
    startDate: "Oct 28, 2024",
    endDate: "Oct 28, 2024",
    days: 1,
    status: "approved",
    reason: "Personal matters",
    appliedDate: "Oct 25, 2024",
    approvedBy: "Jane Smith"
  },
  {
    id: 4,
    type: "Annual Leave",
    startDate: "Sep 10, 2024",
    endDate: "Sep 14, 2024",
    days: 5,
    status: "approved",
    reason: "Summer vacation",
    appliedDate: "Aug 20, 2024",
    approvedBy: "Jane Smith"
  },
  {
    id: 5,
    type: "Sick Leave",
    startDate: "Jan 5, 2025",
    endDate: "Jan 7, 2025",
    days: 3,
    status: "pending",
    reason: "Flu symptoms",
    appliedDate: "Jan 3, 2025",
    approvedBy: null
  }
];

export const LeaveHistory = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="hrms-status-success">Approved</Badge>;
      case 'pending':
        return <Badge className="hrms-status-warning">Pending</Badge>;
      case 'rejected':
        return <Badge className="hrms-status-error">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="hrms-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Leave History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaveHistory.map((leave) => (
            <div
              key={leave.id}
              className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{leave.type}</h4>
                    {getStatusBadge(leave.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {leave.reason}
                  </p>
                </div>
                <Button size="sm" variant="ghost">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">
                      {leave.startDate} - {leave.endDate}
                    </div>
                    <div className="text-muted-foreground">
                      {leave.days} day{leave.days > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Applied</div>
                    <div className="text-muted-foreground">{leave.appliedDate}</div>
                  </div>
                </div>

                {leave.approvedBy && (
                  <div>
                    <div className="font-medium">Approved by</div>
                    <div className="text-muted-foreground">{leave.approvedBy}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {leaveHistory.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No leave history found.</p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t">
          <Button variant="outline" className="w-full">
            Load More History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};