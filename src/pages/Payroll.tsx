import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Eye, Edit, Send, DownloadCloud, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getPayroll, type PayrollResponse, type PayrollItem } from "@/api/payroll";

const computeDeductions = (p: PayrollItem) => {
  const values = [p.pf, p.esi, p.tds, p.professionalTax, p.otherDeductions, p.leaveDeductions];
  return values.reduce((sum, v) => sum + Number(v || 0), 0);
};

const Payroll = () => {
  const [month, setMonth] = useState("this_month");
  const [search] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [payrollData, setPayrollData] = useState<PayrollResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const clearFilters = () => {
    setMonth("this_month");
    setCurrentPage(1);
  };

  const handleCreatePayroll = () => {
    navigate("/payroll/create");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getPayroll({ page: currentPage, limit: 10 });
        setPayrollData(res);
        setError(null);
      } catch (e: any) {
        setPayrollData({ success: false, page: 1, limit: 10, total: 0, totalPages: 1, data: [] });
        setError(e?.response?.data?.message || "Failed to load payroll");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  const handleView = (id: string) => navigate(`/payroll/view/${id}`);
  const handleEdit = (id: string) => navigate(`/payroll/edit/${id}`);
  const handleSend = (id: string) => alert(`Send payroll message for ${id}`);
  const handleDownload = (id: string) => alert(`Download payroll for ${id}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-200 via-emerald-100 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Payroll processed - {payrollData?.data?.length ?? 0}
            </h2>
            <p className="text-sm text-gray-700">
              Payroll runs overview — manage and send payrolls
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={month}
              onValueChange={(val) => {
                setMonth(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[140px] text-sm border-emerald-300 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 focus:outline-none focus:ring-0">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="this_month">This month</SelectItem>
                <SelectItem value="last_month">Last month</SelectItem>
                <SelectItem value="jan">January</SelectItem>
                <SelectItem value="feb">February</SelectItem>
              </SelectContent>
            </Select>

            <button
              onClick={clearFilters}
              className="text-sm px-3 py-2 border border-emerald-300 rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-200 focus:outline-none focus:ring-0"
            >
              Clear filters
            </button>

            <Button
              className="bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-0"
              onClick={handleCreatePayroll}
            >
              Create Payroll
            </Button>
          </div>
        </div>

        {/* Table with horizontal scroll on small devices */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full border-collapse text-xs sm:text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-2 py-2 text-left font-medium text-gray-600">
                    Name
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-600">
                    Code
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-600">
                    Basic
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-600">
                    HRA
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-600">
                    Gross
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-600">
                    Deductions
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-600">
                    Net
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-600">
                    Status
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={9} className="px-4 py-6 text-center text-gray-600">Loading...</td>
                  </tr>
                )}
                {!loading && (payrollData?.data?.length ?? 0) === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-6 text-center text-gray-600">No payroll available</td>
                  </tr>
                )}
                {!loading && payrollData?.data?.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b last:border-0 hover:bg-emerald-50 transition-colors"
                  >
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          {p.employeeId?.profilePhotoUrl ? (
                            <AvatarImage
                              src={p.employeeId.profilePhotoUrl}
                              alt={`${p.employeeId?.firstName ?? ''} ${p.employeeId?.lastName ?? ''}`}
                            />
                          ) : (
                            <AvatarFallback>
                              <User className="h-3.5 w-3.5 text-gray-500" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="leading-tight">
                          <div className="text-xs font-medium text-gray-900">
                            {p.employeeId?.firstName ?? ''} {p.employeeId?.lastName ?? ''}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {p.employeeId?.designation ?? ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2">{p.employeeId?.employeeCode ?? ''}</td>
                    <td className="px-2 py-2">₹{Number(p.basic || 0).toLocaleString()}</td>
                    <td className="px-2 py-2">₹{Number(p.hra || 0).toLocaleString()}</td>
                    <td className="px-2 py-2">₹{Number(p.grossEarnings || 0).toLocaleString()}</td>
                    <td className="px-2 py-2">₹{computeDeductions(p).toLocaleString()}</td>
                    <td className="px-2 py-2 font-semibold">₹{Number(p.netPayable || 0).toLocaleString()}</td>
                    <td className="px-2 py-2">
                      <span
                        className={cn(
                          "text-[11px] px-2 py-0.5 rounded-md",
                          (p.status || '').toLowerCase() === "processed"
                            ? "bg-emerald-100 text-emerald-700"
                            : (p.status || '').toLowerCase() === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        )}
                      >
                        {(p.status || '').charAt(0).toUpperCase() + (p.status || '').slice(1)}
                      </span>
                    </td>

                    <td className="px-2 py-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEdit(p._id)}
                          className="h-7 w-7 flex items-center justify-center rounded text-emerald-600 hover:bg-emerald-100 focus:outline-none focus:ring-0"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleView(p._id)}
                          className="h-7 w-7 flex items-center justify-center rounded text-blue-600 hover:bg-emerald-100 focus:outline-none focus:ring-0"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleSend(p._id)}
                                className="h-7 w-7 flex items-center justify-center rounded text-indigo-600 hover:bg-emerald-100 focus:outline-none focus:ring-0"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Send payroll message
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleDownload(p._id)}
                                className="h-7 w-7 flex items-center justify-center rounded text-gray-700 hover:bg-emerald-100 focus:outline-none focus:ring-0"
                              >
                                <DownloadCloud className="w-3.5 h-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Download payroll</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payroll;
