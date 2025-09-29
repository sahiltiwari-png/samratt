import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronDown, Calendar as CalendarIcon, Pencil } from "lucide-react";

type AttendanceStatus = "Present" | "Absent" | "Half Day";

interface AttendanceRow {
  date: string; // ISO date string
  status: AttendanceStatus;
  clockIn: string;
  clockOut: string;
  workingHours: string;
  markedBy: string;
}

// Simple helper to create demo rows
function generateDemoAttendance(seed: number): AttendanceRow[] {
  const base = [
    { status: "Present", clockIn: "10:00:00", clockOut: "19:00:00", workingHours: "09:00:00", markedBy: "Admin" },
    { status: "Absent", clockIn: "-", clockOut: "-", workingHours: "00:00:00", markedBy: "HR" },
    { status: "Half Day", clockIn: "10:05:00", clockOut: "15:00:00", workingHours: "05:55:00", markedBy: "System" },
  ];
  const rows: AttendanceRow[] = [];
  for (let i = 0; i < 10; i++) {
    const b = base[(seed + i) % base.length];
    const day = String(i + 1).padStart(2, "0");
    rows.push({ date: `2025-09-${day}`, ...b });
  }
  return rows;
}

export default function AttendanceRecord() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Demo employee info derived from id
  const employee = useMemo(() => {
    const numericId = Number(id) || 1;
    const names = [
      { name: "Aditya Yadav", role: "Wordpress developer", initials: "AY" },
      { name: "Karan Bhatya", role: "Wordpress developer", initials: "KB" },
      { name: "Kailash Mewada", role: "Wordpress developer", initials: "KM" },
    ];
    return { id: numericId, ...(names[(numericId - 1) % names.length]) };
  }, [id]);

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const [rows, setRows] = useState<AttendanceRow[]>(() => generateDemoAttendance(Number(id) || 1));
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const getStatusBadge = (status: AttendanceStatus) => {
    const config: Record<AttendanceStatus, { cls: string }> = {
      Present: { cls: "bg-green-100 text-green-800" },
      Absent: { cls: "bg-red-100 text-red-800" },
      "Half Day": { cls: "bg-yellow-100 text-yellow-800" },
    };
    return (
      <Badge className={`${config[status].cls} flex items-center gap-1 px-3 py-1 text-xs rounded-full`}>{status}</Badge>
    );
  };

  const setRowStatus = (index: number, status: AttendanceStatus) => {
    setRows(prev => prev.map((r, i) => i === index ? {
      ...r,
      status,
      clockIn: status === "Absent" ? "-" : r.clockIn,
      clockOut: status === "Absent" ? "-" : (status === "Half Day" ? "15:00:00" : r.clockOut),
      workingHours: status === "Absent" ? "00:00:00" : (status === "Half Day" ? "05:00:00" : r.workingHours),
    } : r));
  };

  return (
    <div className="flex h-screen bg-gradient-to-tr from-green-100 to-green-50 overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="px-2">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold text-gray-800">Attendance Record</h1>
          </div>
        </div>

        <Card className="shadow-md rounded-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-medium">
                {employee.initials}
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">{employee.name}</CardTitle>
                <div className="text-xs text-gray-500">{employee.role}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="relative">
                <Button variant="outline" size="sm" onClick={() => setShowCalendar(!showCalendar)} className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" /> Calendar
                </Button>
                {showCalendar && (
                  <div className="absolute z-10 bg-white p-3 shadow-lg rounded-lg mt-2 right-0">
                    <Calendar
                      mode="range"
                      selected={{ from: fromDate ?? undefined, to: toDate ?? undefined }}
                      onSelect={(range: any) => { setFromDate(range?.from ?? null); setToDate(range?.to ?? null); }}
                    />
                    <div className="flex justify-between text-xs text-gray-600 mt-2">
                      <span>From: {fromDate?.toLocaleDateString() ?? "-"}</span>
                      <span>To: {toDate?.toLocaleDateString() ?? "-"}</span>
                    </div>
                    <Button size="sm" className="w-full mt-2" onClick={() => setShowCalendar(false)}>Set Date</Button>
                  </div>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => { setFromDate(null); setToDate(null); }}>Clear filters</Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-xs sm:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 font-medium text-gray-700">Date</th>
                    <th className="text-left p-3 font-medium text-gray-700">Status</th>
                    <th className="text-left p-3 font-medium text-gray-700">Clockin</th>
                    <th className="text-left p-3 font-medium text-gray-700">Clockout</th>
                    <th className="text-left p-3 font-medium text-gray-700">Working hours</th>
                    <th className="text-left p-3 font-medium text-gray-700">Marked by</th>
                    <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={row.date} className="border-b">
                      <td className="p-3 whitespace-nowrap">{new Date(row.date).toLocaleDateString()}</td>
                      <td className="p-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                              {getStatusBadge(row.status)}
                              <ChevronDown className="w-4 h-4 text-gray-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-32">
                            <DropdownMenuItem onClick={() => setRowStatus(idx, "Present")}>Present</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRowStatus(idx, "Absent")}>Absent</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRowStatus(idx, "Half Day")}>Half Day</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {editingIndex === idx ? (
                          <input className="border rounded px-2 py-1 w-28" value={row.clockIn} onChange={e => setRows(r => r.map((x, i) => i === idx ? { ...x, clockIn: e.target.value } : x))} />
                        ) : (
                          row.clockIn
                        )}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {editingIndex === idx ? (
                          <input className="border rounded px-2 py-1 w-28" value={row.clockOut} onChange={e => setRows(r => r.map((x, i) => i === idx ? { ...x, clockOut: e.target.value } : x))} />
                        ) : (
                          row.clockOut
                        )}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {editingIndex === idx ? (
                          <input className="border rounded px-2 py-1 w-28" value={row.workingHours} onChange={e => setRows(r => r.map((x, i) => i === idx ? { ...x, workingHours: e.target.value } : x))} />
                        ) : (
                          row.workingHours
                        )}
                      </td>
                      <td className="p-3 whitespace-nowrap">{row.markedBy}</td>
                      <td className="p-3">
                        {editingIndex === idx ? (
                          <div className="flex gap-2">
                            <Button size="sm" className="px-3" onClick={() => setEditingIndex(null)}>Save</Button>
                            <Button size="sm" variant="outline" className="px-3" onClick={() => setEditingIndex(null)}>Cancel</Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="ghost" className="text-blue-600" onClick={() => setEditingIndex(idx)}>
                            <Pencil className="w-4 h-4 mr-1" /> Edit
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


