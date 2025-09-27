import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Eye, Edit, Send, DownloadCloud, User, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getPayroll, createPayroll, type PayrollResponse, type PayrollItem } from "@/api/payroll";
import { getEmployees } from "@/api/employees";
import { toast } from "@/hooks/use-toast";

const computeDeductions = (p: PayrollItem) => {
  const values = [p.pf, p.esi, p.tds, p.professionalTax, p.otherDeductions, p.leaveDeductions];
  return values.reduce((sum, v) => sum + Number(v || 0), 0);
};

const Payroll = () => {
  const now = new Date();
  const [month, setMonth] = useState<number>(now.getMonth()); // 0-11
  const [year, setYear] = useState<number>(now.getFullYear());
  const [search] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [payrollData, setPayrollData] = useState<PayrollResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Create Payroll modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeeResults, setEmployeeResults] = useState<any[]>([]);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [modalMonth, setModalMonth] = useState<number>(now.getMonth()); // 0-11
  const [modalYear, setModalYear] = useState<number>(now.getFullYear());

  const clearFilters = () => {
    const d = new Date();
    setMonth(d.getMonth());
    setYear(d.getFullYear());
    setCurrentPage(1);
  };

  const handleCreatePayroll = () => {
    setCreateOpen(true);
    setEmployeeDropdownOpen(false);
    setSelectedEmployeeId("");
    setEmployeeSearch("");
    setModalMonth(now.getMonth());
    setModalYear(now.getFullYear());
  };

  const searchEmployees = async (query: string) => {
    try {
      setEmployeeLoading(true);
      const res = await getEmployees({ page: 1, limit: 10, search: query });
      setEmployeeResults(res.items || res.data || []);
      setEmployeeDropdownOpen(true);
    } catch (e) {
      setEmployeeResults([]);
    } finally {
      setEmployeeLoading(false);
    }
  };

  const selectEmployee = (emp: any) => {
    setSelectedEmployeeId(emp._id);
    setEmployeeSearch(`${emp.firstName} ${emp.lastName} (${emp.employeeCode})`);
    setEmployeeDropdownOpen(false);
  };

  const submitCreatePayroll = async () => {
    try {
      if (!selectedEmployeeId) {
        toast({
          title: "Validation Error",
          description: "Please select an employee.",
          variant: "destructive",
        });
        return;
      }
      const payload = {
        employeeId: selectedEmployeeId,
        month: modalMonth + 1,
        year: modalYear,
      };
      await createPayroll(payload);
      setCreateOpen(false);
      // Refresh current list
      setCurrentPage(1);
      const res = await getPayroll({ page: 1, limit: 10, month: month + 1, year });
      setPayrollData(res);
      toast({ title: "Success", description: "Payroll created successfully." });
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.response?.data?.message || "Failed to create payroll",
        variant: "destructive",
      });
    }
  };

  const monthNames = useMemo(() => [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ], []);

  const years = useMemo(() => {
    const start = 2002;
    const end = 2030;
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, []);

  const visibleRows = useMemo(() => {
    const rows = payrollData?.data ?? [];
    // Fallback client-side filter in case backend ignores query params
    return rows.filter((r) => Number(r.month) === month + 1 && Number(r.year) === year);
  }, [payrollData, month, year]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getPayroll({ page: currentPage, limit: 10, month: month + 1, year });
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
  }, [currentPage, month, year]);

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
              Payroll processed - {visibleRows.length}
            </h2>
            <p className="text-sm text-gray-700">
              Payroll runs overview — manage and send payrolls
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={String(month)}
              onValueChange={(val) => {
                setMonth(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[160px] text-sm border-emerald-300 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 focus:outline-none focus:ring-0">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {monthNames.map((m, idx) => (
                  <SelectItem key={m} value={String(idx)}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={String(year)}
              onValueChange={(val) => {
                setYear(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[140px] text-sm border-emerald-300 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 focus:outline-none focus:ring-0">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
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
                {!loading && visibleRows.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-6 text-center text-gray-600">No data available</td>
                  </tr>
                )}
                {!loading && visibleRows.map((p) => (
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
      {/* Create Payroll Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg focus:outline-none focus:ring-0 focus:border-0">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-emerald-700">Create Payroll</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            {/* Employee field */}
            <div className="grid gap-2 relative">
              <Label>Employee</Label>
              <div className="relative">
                {selectedEmployeeId ? (
                  <div className="flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 bg-white">
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1">
                        <User className="h-4 w-4" />
                        <span className="text-sm font-medium">{employeeSearch}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label="Clear selected employee"
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        setSelectedEmployeeId("");
                        setEmployeeSearch("");
                        setEmployeeDropdownOpen(false);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <Input
                    type="text"
                    placeholder="Search employee by name or code"
                    value={employeeSearch}
                    onChange={(e) => {
                      const v = e.target.value;
                      setEmployeeSearch(v);
                      if (v.trim().length >= 1) {
                        searchEmployees(v.trim());
                      } else {
                        setEmployeeResults([]);
                        setEmployeeDropdownOpen(false);
                      }
                    }}
                    onClick={() => {
                      const q = employeeSearch.trim();
                      searchEmployees(q.length >= 1 ? q : "");
                    }}
                    className="pr-8 focus:outline-none focus:ring-0 focus:border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-300"
                  />
                )}
              </div>
              {employeeDropdownOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg ring-1 ring-black/5 max-h-60 overflow-y-auto p-1">
                  {employeeLoading ? (
                    <div className="p-3 text-sm text-gray-500">Loading...</div>
                  ) : employeeResults.length > 0 ? (
                    employeeResults.map((emp: any) => (
                      <button
                        key={emp._id}
                        type="button"
                        className="w-full text-left px-3 py-2.5 hover:bg-emerald-50 flex items-center justify-between rounded-md"
                        onClick={() => selectEmployee(emp)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            {emp.profilePhotoUrl ? (
                              <AvatarImage src={emp.profilePhotoUrl} alt={`${emp.firstName} ${emp.lastName}`} />
                            ) : null}
                            <AvatarFallback>
                              <User className="h-4 w-4 text-gray-500" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{emp.firstName} {emp.lastName}</span>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{emp.employeeCode}</span>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-sm text-gray-500">No employees found</div>
                  )}
                </div>
              )}
            </div>

            {/* Month and Year */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Month</Label>
                <Select value={String(modalMonth)} onValueChange={(v) => setModalMonth(Number(v))}>
                  <SelectTrigger className="w-full text-sm border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-0">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {monthNames.map((m, idx) => (
                      <SelectItem key={m} value={String(idx)}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Year</Label>
                <Select value={String(modalYear)} onValueChange={(v) => setModalYear(Number(v))}>
                  <SelectTrigger className="w-full text-sm border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-0">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {years.map((y) => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="pt-4 flex gap-2 justify-end">
            <DialogClose asChild>
              <Button variant="outline" className="hover:bg-gray-100 focus:outline-none focus:ring-0 focus:border-0">Cancel</Button>
            </DialogClose>
            <Button className="bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-0 focus:border-0" onClick={submitCreatePayroll}>
              Create Payroll
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payroll;
