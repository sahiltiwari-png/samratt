import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { User, ChevronDown } from "lucide-react";
import { getLeaveRequests, LeaveRequest, Employee } from "@/api/leaves";
import { toast } from "@/components/ui/use-toast";

const LeaveRequests = () => {
  const [status, setStatus] = useState<string>("all");
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRequests, setTotalRequests] = useState(0);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await getLeaveRequests(1, 100); // Fetch more records
      setRequests(response.items);
      setTotalRequests(response.total);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch leave requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (status !== "all" && r.status.toLowerCase() !== status.toLowerCase()) return false;
      return true;
    });
  }, [requests, status]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return "bg-green-100 text-green-700";
      case 'rejected':
        return "bg-red-100 text-red-700";
      case 'applied':
      case 'pending':
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-emerald-50 to-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-emerald-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-emerald-100 rounded"></div>
              <div className="h-4 bg-emerald-100 rounded w-5/6"></div>
              <div className="h-4 bg-emerald-100 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-emerald-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
           <div>
             <h2 className="text-base font-medium text-gray-900">
               Leave Request - {totalRequests}
             </h2>
           </div>

          <div className="flex items-center gap-3">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px] border-emerald-300 bg-emerald-100 text-emerald-700 font-medium hover:bg-emerald-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md border overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="min-w-[950px] w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Leave Type
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Start Date
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    End Date
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Reason
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Total Days
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                     Status
                   </th>
                   <th className="px-4 py-3 text-left font-semibold text-gray-700">
                     Remarks
                   </th>
                   <th className="px-4 py-3 text-left font-semibold text-gray-700">
                     Actions
                   </th>
                </tr>
              </thead>

              <tbody>
                {filteredRequests.length === 0 && (
                   <tr>
                     <td
                       colSpan={9}
                       className="px-4 py-6 text-center text-gray-600"
                     >
                       No leave requests found
                     </td>
                   </tr>
                 )}

                {filteredRequests.map((req) => (
                  <tr
                    key={req._id}
                    className="border-b last:border-0 hover:bg-emerald-50 transition-colors"
                  >
                    {/* Name with avatar */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {req.employeeId.profilePhotoUrl ? (
                            <AvatarImage
                              src={req.employeeId.profilePhotoUrl}
                              alt={`${req.employeeId.firstName} ${req.employeeId.lastName}`}
                            />
                          ) : (
                            <AvatarFallback>
                              <User className="h-4 w-4 text-gray-500" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span className="font-medium text-gray-900" style={{ fontFamily: 'Montserrat', fontWeight: 500, fontSize: '12px', lineHeight: '12.09px' }}>
                            {`${req.employeeId.firstName} ${req.employeeId.lastName}`}
                          </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 capitalize" style={{ fontFamily: 'Montserrat', fontWeight: 500, fontSize: '12px', lineHeight: '12.09px' }}>{req.leaveType}</td>
                      <td className="px-4 py-3" style={{ fontFamily: 'Montserrat', fontWeight: 500, fontSize: '12px', lineHeight: '12.09px' }}>{formatDate(req.startDate)}</td>
                      <td className="px-4 py-3" style={{ fontFamily: 'Montserrat', fontWeight: 500, fontSize: '12px', lineHeight: '12.09px' }}>{formatDate(req.endDate)}</td>
                      <td className="px-4 py-3" style={{ fontFamily: 'Montserrat', fontWeight: 500, fontSize: '12px', lineHeight: '12.09px' }}>{req.reason}</td>
                      <td className="px-4 py-3" style={{ fontFamily: 'Montserrat', fontWeight: 500, fontSize: '12px', lineHeight: '12.09px' }}>{req.days}</td>

                    {/* Status badge */}
                     <td className="px-4 py-3">
                       <span
                         className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(req.status)}`}
                       >
                         {req.status}
                       </span>
                     </td>

                     {/* Remarks */}
                       <td className="px-4 py-3 text-gray-600" style={{ fontFamily: 'Montserrat', fontWeight: 500, fontSize: '12px', lineHeight: '12.09px' }}>
                         {req.remarks || "Empty remarks"}
                       </td>

                     {/* Actions */}
                     <td className="px-4 py-3">
                       <Button
                         size="sm"
                         className="bg-emerald-600 text-white hover:bg-emerald-700"
                       >
                         Update
                       </Button>
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hide scrollbars */}
        <style jsx global>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default LeaveRequests;
