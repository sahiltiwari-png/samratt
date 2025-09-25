import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter, Eye, Pencil } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const Attendance = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Dummy data for employees attendance
  const employeesAttendance = [
    {
      id: 1,
      name: "Aditya Yadav",
      position: "Wordpress developer",
      status: "Present",
      clockIn: "10:00:00",
      clockOut: "19:00:00",
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Karan Bhatiya",
      position: "Wordpress developer",
      status: "Present",
      clockIn: "10:05:00",
      clockOut: "19:00:00",
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Kailash Mewada",
      position: "Wordpress developer",
      status: "Half day",
      clockIn: "-",
      clockOut: "-",
      avatar: "/placeholder.svg"
    }
  ];

  // Function to get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "absent":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "half day":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="p-6 overflow-x-hidden min-h-screen">
      <Card className="shadow-md rounded-xl">
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pt-4">
            <h2 className="text-xl font-medium">Today's Employees Attendance</h2>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1 text-xs h-7 px-2 bg-green-50 border-green-100">
                    <CalendarIcon className="h-3 w-3" />
                    <span>Calendar</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                      if (date) {
                        setDate(date);
                        setIsCalendarOpen(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Select>
                <SelectTrigger className="w-[100px] text-xs h-7 bg-gray-50 border-gray-100">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">All</SelectItem>
                  <SelectItem value="present" className="text-xs">Present</SelectItem>
                  <SelectItem value="absent" className="text-xs">Absent</SelectItem>
                  <SelectItem value="half-day" className="text-xs">Half Day</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="text-gray-500 text-xs h-7 px-2 border-gray-200 bg-white hover:text-green-600 hover:border-green-300 mt-2 md:mt-0">
                Clear filters
              </Button>
            </div>
          </div>



          {/* Attendance Table */}
          <div className="rounded-lg border bg-white overflow-x-auto max-h-[500px] overflow-y-auto mx-auto w-full" style={{ touchAction: 'pan-y' }}>
            <table className="w-full text-sm border-separate border-spacing-0" style={{ borderRadius: '12px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', tableLayout: 'auto' }}>
              <colgroup className="md:table-column-group">
                <col className="w-[40%] md:w-[30%]" />
                <col className="w-[20%] md:w-[20%]" />
                <col className="hidden md:table-column w-[20%]" />
                <col className="hidden md:table-column w-[20%]" />
                <col className="w-[40%] md:w-[10%]" />
              </colgroup>
              <thead>
                <tr className="text-gray-700 font-semibold border-b bg-gradient-to-r from-green-50 to-white">
                  <th className="px-3 py-3 text-left rounded-tl-lg">Name</th>
                  <th className="px-3 py-3 text-left">Status</th>
                  <th className="px-3 py-3 text-left hidden md:table-cell">ClockIn</th>
                  <th className="px-3 py-3 text-left hidden md:table-cell">Clockout</th>
                  <th className="px-3 py-3 text-left rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employeesAttendance.map((employee) => (
                  <tr key={employee.id} className="border-b last:border-b-0 hover:bg-green-50 transition-colors">
                    <td className="px-3 py-3 max-w-xs truncate align-middle">
                      <div className="flex flex-row items-center gap-2 md:gap-3 w-full">
                        <Avatar className="h-8 w-8 md:h-10 md:w-10">
                          <AvatarImage src={employee.avatar} alt={employee.name} />
                          <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="truncate flex-col">
                          <div className="font-medium text-gray-900 leading-tight text-xs md:text-sm truncate">{employee.name}</div>
                          <div className="text-xs md:text-sm text-gray-500">{employee.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 align-middle">
                      <Badge className={cn("font-normal text-xs md:text-sm", getStatusBadgeClass(employee.status))}>
                        {employee.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 align-middle text-sm hidden md:table-cell">{employee.clockIn}</td>
                    <td className="px-3 py-3 align-middle text-sm hidden md:table-cell">{employee.clockOut}</td>
                    <td className="px-3 py-3 align-middle">
                      <div className="flex space-x-1">
                        <Button variant="link" size="icon" className="text-blue-600 h-8 w-8 p-0">
                          <Eye className="w-4 h-4 md:w-5 md:h-5" />
                        </Button>
                        <Button variant="link" size="icon" className="text-green-600 h-8 w-8 p-0">
                          <Pencil className="w-4 h-4 md:w-5 md:h-5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center mt-6 text-sm">
            <Button variant="ghost" size="sm" className="text-sm h-9 px-3">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>
            
            <div className="flex items-center">
              <Button variant="default" size="sm" className="mx-1 h-9 w-9 p-0 text-sm">1</Button>
              <Button variant="ghost" size="sm" className="mx-1 h-9 w-9 p-0 text-sm">2</Button>
              <Button variant="ghost" size="sm" className="mx-1 h-9 w-9 p-0 text-sm">3</Button>
            </div>
            
            <Button variant="ghost" size="sm" className="text-sm h-9 px-3">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;