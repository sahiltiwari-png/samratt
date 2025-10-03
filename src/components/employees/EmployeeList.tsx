// Reusable filter bar component
const EmployeeFilterBar = ({
  statusFilter,
  setStatusFilter,
  designationFilter,
  setDesignationFilter,
  onClear,
  onAddEmployee,
  total
}: {
  statusFilter: string | null,
  setStatusFilter: (v: string | null) => void,
  designationFilter: string | null,
  setDesignationFilter: (v: string | null) => void,
  onClear: () => void,
  onAddEmployee: () => void,
  total: number
}) => {
  // Example options, replace with dynamic if needed
  const statusOptions = ["Active", "Inactive"];
  // Provided designations list
  const designations = [
    // Entry Level
    "Intern",
    "Trainee",
    "Associate",
    "Junior Executive",
    "Executive",
    "Coordinator",

    // Mid Level
    "Senior Executive",
    "Specialist",
    "Analyst",
    "Consultant",
    "Assistant Manager",
    "Team Lead",
    "Supervisor",

    // Managerial
    "Manager",
    "Senior Manager",
    "Project Manager",
    "Program Manager",
    "Product Manager",
    "Operations Manager",
    "Delivery Manager",

    // Leadership
    "General Manager",
    "Associate Director",
    "Director",
    "Vice President",
    "Senior Vice President",
    "CEO",
    "CTO",
    "CIO",
    "COO",
    "CFO",
    "CMO",
    "CHRO",
    "CSO",

    // IT / Technical
    "Software Engineer",
    "Senior Software Engineer",
    "Full Stack Developer",
    "Backend Developer",
    "Frontend Developer",
    "Mobile App Developer",
    "DevOps Engineer",
    "Cloud Engineer",
    "QA Engineer",
    "Test Analyst",
    "Automation Tester",
    "UI/UX Designer",
    "System Administrator",
    "Database Administrator",
    "Network Engineer",
    "Security Analyst",
    "Technical Lead",
    "Solution Architect",
    "Technical Project Manager",
    "Engineering Manager",
    "VP Engineering",

    // Sales
    "Sales Executive",
    "Business Development Executive",
    "Business Development Manager",
    "Inside Sales Executive",
    "Sales Consultant",
    "Relationship Manager",
    "Key Account Manager",
    "Territory Sales Manager",
    "Regional Sales Manager",
    "National Sales Manager",
    "Head of Sales",
    "Vice President Sales",
    "Chief Sales Officer",

    // Marketing
    "Marketing Executive",
    "Digital Marketing Executive",
    "SEO Specialist",
    "PPC Specialist",
    "Content Writer",
    "Copywriter",
    "Social Media Executive",
    "Brand Executive",
    "Marketing Analyst",
    "Marketing Manager",
    "Product Marketing Manager",
    "Campaign Manager",
    "Growth Manager",
    "Regional Marketing Manager",
    "Head of Marketing",
    "Vice President Marketing",
    "Chief Marketing Officer",

    // HR & Admin
    "HR Executive",
    "HR Generalist",
    "Recruiter",
    "Talent Acquisition Specialist",
    "HR Manager",
    "HR Business Partner",
    "Training & Development Manager",
    "Payroll Specialist",
    "Admin Executive",
    "Office Manager",

    // Finance & Accounts
    "Accounts Executive",
    "Junior Accountant",
    "Senior Accountant",
    "Finance Analyst",
    "Accounts Manager",
    "Finance Manager",
    "Internal Auditor",
    "Financial Controller",

    // Operations / Support
    "Operations Executive",
    "Operations Manager",
    "Process Specialist",
    "Customer Support Executive",
    "Client Service Manager",
    "Technical Support Engineer",
    "Service Delivery Manager"
  ];
  const [designationOpen, setDesignationOpen] = useState(false);
  return (
    <div className="flex flex-col md:flex-row md:flex-nowrap md:items-center md:justify-between gap-3 mb-4 w-full pb-2 rounded-lg p-3 bg-white">
      <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
        <span className="font-medium text-base text-[#2C373B]">Total Employees - {total}</span>
        <select
          className="rounded border border-emerald-300 h-8 px-3 bg-[rgb(209,250,229)] text-[#2C373B] focus:outline-none focus:ring-2 focus:ring-emerald-200 min-w-[120px]"
          value={statusFilter || ""}
          onChange={e => setStatusFilter(e.target.value === "" ? null : e.target.value)}
        >
          <option value="">Status</option>
          {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        {/* Searchable Designation Dropdown */}
        <Popover open={designationOpen} onOpenChange={setDesignationOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-expanded={designationOpen}
              className="rounded border border-emerald-300 h-8 px-3 bg-[rgb(209,250,229)] text-[#2C373B] focus:outline-none focus:ring-2 focus:ring-emerald-200 min-w-[180px] inline-flex items-center justify-between"
            >
              <span className="truncate">{designationFilter || "Designation"}</span>
              <ChevronDown className="ml-2 h-4 w-4 opacity-60" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[240px]">
            <Command>
              <CommandInput placeholder="Search designation..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {designations.map((d) => (
                    <CommandItem
                      key={d}
                      value={d}
                      onSelect={(value) => {
                        setDesignationFilter(value === "" ? null : value);
                        setDesignationOpen(false);
                      }}
                    >
                      {d}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <button
          className="inline-flex items-center gap-1 h-8 px-3 rounded border border-[#4CDC9C] bg-[#4CDC9C] text-[#2C373B] text-sm transition shadow-sm hover:bg-[#3fd190]"
          onClick={onClear}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          Clear Filters
        </button>
      </div>
      <div className="flex-shrink-0">
        <button
          className="bg-[#4CDC9C] hover:bg-[#3fd190] text-[#2C373B] font-semibold px-4 h-8 rounded transition"
          onClick={onAddEmployee}
        >
          Add Employee
        </button>
      </div>
    </div>
  );
};
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, MoreVertical, ChevronDown } from "lucide-react";
import { Eye, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { getEmployees, getEmployeeById } from "@/api/employees";
import { uploadFile } from "@/api/uploadFile";
import { useRef } from "react";
import API from "@/api/auth";



interface EmployeeListProps {
  searchTerm: string;
}

interface Employee {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  employeeCode?: string;
  designation?: string;
  status?: string;
  createdAt?: string;
  dateOfJoining?: string;
  probationEndDate?: string;
  profilePhotoUrl?: string;
}



const EmployeeList = ({ searchTerm }: EmployeeListProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [designationFilter, setDesignationFilter] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeDetails, setEmployeeDetails] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        // Assume getEmployees accepts params for page, limit, status, designation, search
        const data = await getEmployees({ page, limit: 10, status: statusFilter, designation: designationFilter, search: searchTerm });
        setEmployees(Array.isArray(data.items) ? data.items : []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setEmployees([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [page, statusFilter, designationFilter, searchTerm]);

  const handleStatusChange = (id: string, newStatus: string) => {
    setEmployees((prev) => prev.map(emp => emp._id === id ? { ...emp, status: newStatus } : emp));
    // TODO: Call API to update status if needed
  };

  const clearFilters = () => {
    setStatusFilter(null);
    setDesignationFilter(null);
  };

  return (
    <Card className="shadow-md rounded-xl">
      <CardContent>
        <EmployeeFilterBar
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          designationFilter={designationFilter}
          setDesignationFilter={setDesignationFilter}
          onClear={clearFilters}
          onAddEmployee={() => navigate('/add-employee')}
          total={total}
        />
        <div className="rounded-lg border bg-white overflow-x-auto max-h-[500px] overflow-y-auto mx-auto" style={{ width: '100%', maxWidth: '1200px', minWidth: '0', touchAction: 'pan-y' }}>
          <table className="w-full border-separate border-spacing-0" style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', tableLayout: 'auto' }}>
            <colgroup>
              <col style={{ width: '16%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '6%' }} />
            </colgroup>
            <thead className="text-[#2C373B]">
              <tr className="border-b bg-white">
                <th className="px-1 py-1 text-left rounded-tl-lg" style={{fontSize: '12px', fontWeight: 600}}>Name</th>
                <th className="px-1 py-1 text-left" style={{fontSize: '12px', fontWeight: 600}}>Code</th>
                <th className="px-1 py-1 text-left" style={{fontSize: '12px', fontWeight: 600}}>Designation</th>
                <th className="px-1 py-1 text-left" style={{fontSize: '12px', fontWeight: 600}}>Joining</th>
                <th className="px-1 py-1 text-left" style={{fontSize: '12px', fontWeight: 600}}>Probation</th>
                <th className="px-1 py-1 text-left" style={{fontSize: '12px', fontWeight: 600}}>Email</th>
                <th className="px-1 py-1 text-left" style={{fontSize: '12px', fontWeight: 600}}>Status</th>
                <th className="px-1 py-1 text-left rounded-tr-lg" style={{fontSize: '12px', fontWeight: 600}}>Actions</th>
              </tr>
            </thead>
            <tbody className="text-[#2C373B]" style={{fontSize: '14px', fontWeight: 500}}>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-8">Loading...</td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No employees found.</td></tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id} className="border-b last:border-b-0 bg-white hover:bg-gray-50 transition-colors">
                    <td className="px-1 py-1 max-w-xs truncate align-middle">
                      <div className="flex flex-row items-center gap-1 w-full">
                        <Avatar className="h-8 w-8">
                          {emp.profilePhotoUrl ? (
                            <AvatarImage src={emp.profilePhotoUrl} alt={emp.firstName + ' ' + emp.lastName} />
                          ) : (
                            <AvatarFallback>{emp.firstName?.[0] || ''}{emp.lastName?.[0] || ''}</AvatarFallback>
                          )}
                        </Avatar>
                        <div className="truncate flex items-center gap-1">
                          <span className="font-medium text-[#2C373B] leading-tight text-[14px] truncate">{emp.firstName} {emp.lastName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-1 py-1 max-w-xs truncate align-middle">{emp.employeeCode || '-'}</td>
                    <td className="px-1 py-1 max-w-xs truncate align-middle">{emp.designation || '-'}</td>
                    <td className="px-1 py-1 max-w-xs truncate align-middle">{emp.dateOfJoining ? new Date(emp.dateOfJoining).toLocaleDateString() : (emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : '-')}</td>
                    <td className="px-1 py-1 max-w-xs truncate align-middle">{emp.probationEndDate ? new Date(emp.probationEndDate).toLocaleDateString() : '-'}</td>
                    <td className="px-1 py-1 align-middle">{emp.email || '-'}</td>
                    <td className="px-1 py-1 align-middle">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" className="min-w-[90px] px-3 py-1 bg-[#4CDC9C] text-[#2C373B] hover:bg-[#3fd190] border-none">{emp.status === 'active' ? 'Active' : 'Inactive'}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleStatusChange(emp._id, 'active')} className="text-[#2C373B]">Active</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(emp._id, 'inactive')} className="text-[#2C373B]">Inactive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          className="bg-[#4CDC9C] text-[#2C373B] hover:bg-[#3fd190]"
                          title="View details"
                          onClick={async () => {
                            setSelectedEmployee(emp);
                            setModalOpen(true);
                            setLoadingDetails(true);
                            setEditMode(false);
                            setUpdateMessage(null);
                            try {
                              const details = await getEmployeeById(emp._id);
                              setEmployeeDetails(details);
                              setFormData(details);
                            } catch (e) {
                              setEmployeeDetails(null);
                            } finally {
                              setLoadingDetails(false);
                            }
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          className="bg-[#4CDC9C] text-[#2C373B] hover:bg-[#3fd190]"
                          title="Edit details"
                          onClick={async () => {
                            setSelectedEmployee(emp);
                            setModalOpen(true);
                            setLoadingDetails(true);
                            setEditMode(true);
                            setUpdateMessage(null);
                            try {
                              const details = await getEmployeeById(emp._id);
                              setEmployeeDetails(details);
                              setFormData(details);
                            } catch (e) {
                              setEmployeeDetails(null);
                            } finally {
                              setLoadingDetails(false);
                            }
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Employee Details Modal (UI only, no API yet) */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader className="mb-2 pb-2 border-b">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  <img
                    src={profilePreview || employeeDetails?.profilePhotoUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent((employeeDetails?.firstName || '') + ' ' + (employeeDetails?.lastName || ''))}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border shadow"
                  />
                  {editMode && (
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 shadow hover:bg-blue-700"
                      onClick={() => fileInputRef.current?.click()}
                      title="Upload Photo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5v-6m0 0V7.5m0 3h3m-3 0H9m12 6.75A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75V7.5A2.25 2.25 0 0 1 5.25 5.25h3.379a2.25 2.25 0 0 0 1.591-.659l1.5-1.5a2.25 2.25 0 0 1 3.18 0l1.5 1.5a2.25 2.25 0 0 0 1.591.659h3.379A2.25 2.25 0 0 1 21 7.5v11.25Z" />
                      </svg>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = ev => setProfilePreview(ev.target?.result as string);
                            reader.readAsDataURL(file);
                            // Upload immediately and set URL
                            try {
                              const url = await uploadFile(file);
                              setFormData((fd: any) => ({ ...fd, profilePhotoUrl: url }));
                            } catch {
                              // Optionally show error
                            }
                          }
                        }}
                      />
                    </button>
                  )}
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-black tracking-tight mb-1">{employeeDetails?.firstName} {employeeDetails?.lastName}</DialogTitle>
                  <div className="text-gray-500 text-xs">{employeeDetails?.designation || ''} {employeeDetails?.department ? `| ${employeeDetails.department}` : ''}</div>
                  <div className="text-gray-400 text-xs mt-1">{employeeDetails?.email}</div>
                  {(() => {
                    const primaryRoleName = (
                      (employeeDetails?.role && (typeof employeeDetails.role === 'string' ? employeeDetails.role : employeeDetails.role?.name)) ||
                      (Array.isArray(employeeDetails?.roles) && employeeDetails.roles.length > 0 && (typeof employeeDetails.roles[0] === 'string' ? employeeDetails.roles[0] : employeeDetails.roles[0]?.name))
                    );
                    return primaryRoleName ? (
                      <div className="mt-2 flex flex-wrap gap-1 items-center">
                        <span className="text-xs text-gray-500 mr-1">Role:</span>
                        <Badge className="text-[#2C373B] bg-[rgb(209,250,229)] border border-emerald-200 px-2 py-0.5">
                          {String(primaryRoleName)}
                        </Badge>
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
            </DialogHeader>
            {selectedEmployee && (
              <div className="space-y-4 text-sm p-2 md:p-4 bg-white">
                {loadingDetails ? (
                  <div>Loading...</div>
                ) : employeeDetails ? (
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                    {[
                      "firstName","lastName","phone","department","designation","grade","dateOfJoining","probationEndDate","employmentType","shiftId","status","reportingManagerId","dob","gender","bloodGroup","maritalStatus","nationality","addressLine1","addressLine2","country","state","city","zipCode","aadhaarNo","panNo","passportNo","salaryStructureId","benefits","skills","loginEnabled","isActive","camsEmployeeId"
                    ].map((key) => {
                      const value = employeeDetails[key];
                      if (typeof value === "object" && value !== null) return null;
                      let inputType = "text";
                      if (["dateOfJoining", "probationEndDate", "dob"].includes(key)) inputType = "date";
                      let inputValue = formData[key] || '';
                      if (inputType === "date" && inputValue) {
                        inputValue = inputValue.slice(0, 10); // yyyy-mm-dd
                      }
                      return (
                        <div key={key} className="flex flex-col mb-2">
                          <label className="font-semibold capitalize mb-1" style={{color: '#2C373B'}}>{key.replace(/([A-Z])/g, ' $1')}</label>
                          {editMode ? (
                            <input
                              className="border border-emerald-300 rounded px-2 py-1 bg-[rgb(209,250,229)] text-[#2C373B] focus:outline-none focus:ring-2 focus:ring-emerald-200 transition"
                              type={inputType}
                              value={inputValue}
                              onChange={e => setFormData((fd: any) => ({ ...fd, [key]: e.target.value }))}
                            />
                          ) : (
                            <span className="rounded px-2 py-1 border border-emerald-200 bg-[rgb(209,250,229)] text-[#2C373B]">{inputType === 'date' && value ? new Date(value).toLocaleDateString() : (value !== undefined && value !== null && value !== '' ? value.toString() : '-')}</span>
                          )}
                        </div>
                      );
                    })}
                    {/* Bank Details */}
                    {employeeDetails.bankDetails && Object.entries(employeeDetails.bankDetails).map(([k, v]) => (
                      <div key={"bankDetails" + k} className="flex flex-col">
                        <label className="font-semibold capitalize" style={{color: '#2C373B'}}>Bank {k.replace(/([A-Z])/g, ' $1')}</label>
                        {editMode ? (
                          <input className="border border-emerald-300 rounded px-2 py-1 bg-[rgb(209,250,229)] text-[#2C373B]" value={formData.bankDetails?.[k] || ''} onChange={e => setFormData((fd: any) => ({ ...fd, bankDetails: { ...fd.bankDetails, [k]: e.target.value } }))} />
                        ) : (
                          <span className="rounded px-2 py-1 border border-emerald-200 bg-[rgb(209,250,229)] text-[#2C373B]">{v || '-'}</span>
                        )}
                      </div>
                    ))}
                    {/* Tax Details */}
                    {employeeDetails.taxDetails && Object.entries(employeeDetails.taxDetails).map(([k, v]) => (
                      <div key={"taxDetails" + k} className="flex flex-col">
                        <label className="font-semibold capitalize" style={{color: '#2C373B'}}>Tax {k.replace(/([A-Z])/g, ' $1')}</label>
                        {editMode ? (
                          <input className="border border-emerald-300 rounded px-2 py-1 bg-[rgb(209,250,229)] text-[#2C373B]" value={formData.taxDetails?.[k] || ''} onChange={e => setFormData((fd: any) => ({ ...fd, taxDetails: { ...fd.taxDetails, [k]: e.target.value } }))} />
                        ) : (
                          <span className="rounded px-2 py-1 border border-emerald-200 bg-[rgb(209,250,229)] text-[#2C373B]">{v || '-'}</span>
                        )}
                      </div>
                    ))}
                    {/* Emergency Contact */}
                    {employeeDetails.emergencyContact && Object.entries(employeeDetails.emergencyContact).map(([k, v]) => (
                      <div key={"emergencyContact" + k} className="flex flex-col">
                        <label className="font-semibold capitalize" style={{color: '#2C373B'}}>Emergency {k.replace(/([A-Z])/g, ' $1')}</label>
                        {editMode ? (
                          <input className="border border-emerald-300 rounded px-2 py-1 bg-[rgb(209,250,229)] text-[#2C373B]" value={formData.emergencyContact?.[k] || ''} onChange={e => setFormData((fd: any) => ({ ...fd, emergencyContact: { ...fd.emergencyContact, [k]: e.target.value } }))} />
                        ) : (
                          <span className="rounded px-2 py-1 border border-emerald-200 bg-[rgb(209,250,229)] text-[#2C373B]">{v || '-'}</span>
                        )}
                      </div>
                    ))}
                  </form>
                ) : (
                  <div>No details found.</div>
                )}
                {updateMessage && <div className={updateMessage.includes('success') ? 'text-green-600' : 'text-red-600'}>{updateMessage}</div>}
              </div>
            )}
            <DialogFooter>
              {/* Only show Update button if in edit mode */}
              {employeeDetails && editMode && (
                <> 
                  <button className="bg-[#4CDC9C] text-[#2C373B] px-4 py-2 rounded hover:bg-[#3fd190]" disabled={updateLoading}
                    onClick={async () => {
                      setUpdateLoading(true);
                      setUpdateMessage(null);
                      try {
                        const submitData = { ...formData };
                        await API.put(`/auth/employees/${selectedEmployee?._id}`, submitData);
                        setUpdateMessage('Update success!');
                        setEditMode(false);
                        setProfilePreview(null);
                      } catch (e) {
                        setUpdateMessage('Update failed!');
                      } finally {
                        setUpdateLoading(false);
                      }
                    }}
                  >
                    {updateLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    className="ml-2 px-4 py-2 rounded bg-[#4CDC9C] text-[#2C373B] hover:bg-[#3fd190]"
                    onClick={() => { setEditMode(false); setFormData(employeeDetails); setProfilePreview(null); }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <Button size="sm" className="bg-[#4CDC9C] text-[#2C373B] hover:bg-[#3fd190]" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button key={p} size="sm" className={`mx-1 ${p === page ? 'bg-[#3fd190]' : 'bg-[#4CDC9C]'} text-[#2C373B] hover:bg-[#3fd190]`} onClick={() => setPage(p)}>{p}</Button>
            ))}
            <Button size="sm" className="bg-[#4CDC9C] text-[#2C373B] hover:bg-[#3fd190]" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeList;