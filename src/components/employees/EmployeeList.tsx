import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, MoreVertical, ChevronDown, Search as SearchIcon } from "lucide-react";
import { Eye, Pencil } from "lucide-react";
import { getEmployees, getEmployeeById } from "@/api/employees";
import { uploadFile } from "@/api/uploadFile";
import { getRoles } from "@/api/roles";
import { assignRoleToUser } from "@/api/assignRole";
import API from "@/api/auth";

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
  const designationOptions = ["Manager", "Developer", "HR", "Designer"];
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 w-full pb-4">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="font-medium text-base text-gray-800">Total Employees - {total}</span>
        <select
          className="rounded border px-3 py-1 bg-green-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-200 min-w-[120px]"
          value={statusFilter || ""}
          onChange={e => setStatusFilter(e.target.value === "" ? null : e.target.value)}
        >
          <option value="">Status</option>
          {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <select
          className="rounded border px-3 py-1 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 min-w-[140px]"
          value={designationFilter || ""}
          onChange={e => setDesignationFilter(e.target.value === "" ? null : e.target.value)}
        >
          <option value="">Designation</option>
          {designationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <button
          className="inline-flex items-center gap-1 px-3 py-1 rounded border border-gray-200 bg-white text-gray-500 hover:text-green-600 hover:border-green-300 text-sm transition shadow-sm"
          onClick={onClear}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          Clear Filters
        </button>
      </div>
      <div>
        <button
          className="bg-green-400 hover:bg-green-500 text-white font-semibold px-6 py-2 rounded transition"
          onClick={onAddEmployee}
        >
          Add Employee
        </button>
      </div>
    </div>
  );
};



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
  roles?: { _id: string; name: string; }[]; // Updated to reflect the actual structure
  createdAt?: string;
  dateOfJoining?: string;
  probationEndDate?: string;
  profilePhotoUrl?: string;
}



// Shared Designation list
const DESIGNATION_OPTIONS = [
  "Intern","Trainee","Associate","Junior Executive","Executive","Coordinator",
  "Senior Executive","Specialist","Analyst","Consultant","Assistant Manager","Team Lead","Supervisor",
  "Manager","Senior Manager","Project Manager","Program Manager","Product Manager","Operations Manager","Delivery Manager",
  "General Manager","Associate Director","Director","Vice President","Senior Vice President","CEO","CTO","CIO","COO","CFO","CMO","CHRO","CSO",
  "Software Engineer","Senior Software Engineer","Full Stack Developer","Backend Developer","Frontend Developer","Mobile App Developer","DevOps Engineer","Cloud Engineer","QA Engineer","Test Analyst","Automation Tester","UI/UX Designer","System Administrator","Database Administrator","Network Engineer","Security Analyst","Technical Lead","Solution Architect","Technical Project Manager","Engineering Manager","VP Engineering",
  "Sales Executive","Business Development Executive","Business Development Manager","Inside Sales Executive","Sales Consultant","Relationship Manager","Key Account Manager","Territory Sales Manager","Regional Sales Manager","National Sales Manager","Head of Sales","Vice President Sales","Chief Sales Officer",
  "Marketing Executive","Digital Marketing Executive","SEO Specialist","PPC Specialist","Content Writer","Copywriter","Social Media Executive","Brand Executive","Marketing Analyst","Marketing Manager","Product Marketing Manager","Campaign Manager","Growth Manager","Regional Marketing Manager","Head of Marketing","Vice President Marketing","Chief Marketing Officer",
  "HR Executive","HR Generalist","Recruiter","Talent Acquisition Specialist","HR Manager","HR Business Partner","Training & Development Manager","Payroll Specialist","Admin Executive","Office Manager",
  "Accounts Executive","Junior Accountant","Senior Accountant","Finance Analyst","Accounts Manager","Finance Manager","Internal Auditor","Financial Controller",
  "Operations Executive","Operations Manager","Process Specialist","Customer Support Executive","Client Service Manager","Technical Support Engineer","Service Delivery Manager"
];

const DesignationSelect = ({ value, onChange, label }: { value: string | null; onChange: (v: string | null) => void; label?: string | null }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = DESIGNATION_OPTIONS.filter(opt => opt.toLowerCase().includes(query.toLowerCase()));
  const displayValue = value || "";
  return (
    <div className="flex flex-col">
      {(typeof label === 'string' && label.length > 0) && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        <input
          value={displayValue}
          onChange={e => { const v = e.target.value; onChange(v); setQuery(v); setOpen(true); }}
          onClick={() => setOpen(o => !o)}
          placeholder="Designation"
          className="w-full rounded border px-3 py-1 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-200"
        />
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        {open && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow max-h-56 overflow-auto">
            <div className="flex items-center gap-2 p-2 border-b">
              <SearchIcon className="w-4 h-4 text-gray-400" />
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full text-sm outline-none"
              />
            </div>
            {filtered.length === 0 ? (
              <div className="p-2 text-xs text-gray-500">No results</div>
            ) : (
              filtered.map((opt, index) => (
                <button key={`${opt}-${index}`} type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-green-50" onClick={() => { onChange(opt); setQuery(opt); setOpen(false); }}>
                  {opt}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const RoleSelect = ({ value, onChange, roles, label }: { value: string | null; onChange: (v: string | null) => void; roles: any[]; label?: string | null }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = roles.filter(role => role.name.toLowerCase().includes(query.toLowerCase()));
  
  // Find the role name for display based on the stored role ID
  const selectedRole = roles.find(role => role._id === value);
  const displayValue = selectedRole ? selectedRole.name : "";
  
  return (
    <div className="flex flex-col">
      {(typeof label === 'string' && label.length > 0) && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        <input
          value={displayValue}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onClick={() => setOpen(o => !o)}
          placeholder="Role"
          className="w-full rounded border px-3 py-1 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-200"
        />
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        {open && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow max-h-56 overflow-auto">
            <div className="flex items-center gap-2 p-2 border-b">
              <SearchIcon className="w-4 h-4 text-gray-400" />
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full text-sm outline-none"
              />
            </div>
            {filtered.length === 0 ? (
              <div className="p-2 text-xs text-gray-500">No results</div>
            ) : (
              filtered.map(role => (
                <button key={role._id} type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-green-50" onClick={() => { onChange(role._id); setQuery(role.name); setOpen(false); }}>
                  {role.name}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

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
  const [roles, setRoles] = useState<any[]>([]);

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

  useEffect(() => {
    getRoles().then(roles => {
      setRoles(roles);
    }).catch(() => {
      console.error('❌ Failed to load roles');
      setRoles([]);
    });
  }, []);

  // Sync role when roles are loaded and we have employee details
  useEffect(() => {
    if (roles.length > 0 && employeeDetails && employeeDetails.roles && employeeDetails.roles.length > 0) {
      const firstRole = employeeDetails.roles[0];
      let roleObj;
      

      
      if (typeof firstRole === 'string') {
        // If firstRole is a string, it could be either role ID or role name
        // First try to find by ID, then by name
        roleObj = roles.find(r => r._id === firstRole);

        if (!roleObj) {
          roleObj = roles.find(r => r.name === firstRole);

        }
      } else {
        // If firstRole is an object, find by ID
        roleObj = roles.find(r => r._id === firstRole._id);

      }
      
      if (roleObj) {
        setFormData((fd: any) => ({ ...fd, role: roleObj._id }));
      }
    }
  }, [roles, employeeDetails]);

  const handleStatusChange = (id: string, newStatus: string) => {
    setEmployees((prev) => prev.map(emp => emp._id === id ? { ...emp, status: newStatus } : emp));
    // TODO: Call API to update status if needed
  };

  const clearFilters = () => {
    setStatusFilter(null);
    setDesignationFilter(null);
  };

  const fetchEmployeeDetails = useCallback(async (id: string) => {
    setLoadingDetails(true);
    try {
      const details = await getEmployeeById(id);

      setEmployeeDetails(details);
      // Initialize formData with basic details first
      const initialFormData = { ...details };
      // Role will be set by useEffect when roles are available
      initialFormData.role = '';
      setFormData(initialFormData);
    } catch (e) {
      console.error('❌ Fetch Employee Details - Error:', e);
      setEmployeeDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  }, [setEmployeeDetails, setFormData, getEmployeeById]);

  return (
    <Card className="shadow-md rounded-xl">
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 w-full pb-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-medium text-base text-gray-800">Total Employees - {total}</span>
            <select
              className="rounded border px-3 py-1 bg-green-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-200 min-w-[120px]"
              value={statusFilter || ""}
              onChange={e => setStatusFilter(e.target.value === "" ? null : e.target.value)}
            >
              <option value="">Status</option>
              {['active','inactive','terminated'].map(opt => <option key={opt} value={opt.toLowerCase()}>{opt}</option>)}
            </select>
            <div className="min-w-[200px]">
              <DesignationSelect value={designationFilter} onChange={setDesignationFilter} />
            </div>
            <button
              className="inline-flex items-center gap-1 px-3 py-1 rounded border border-gray-200 bg-white text-gray-500 hover:text-green-600 hover:border-green-300 text-sm transition shadow-sm"
              onClick={clearFilters}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              Clear Filters
            </button>
          </div>
          <div>
            <button
              className="bg-green-400 hover:bg-green-500 text-white font-semibold px-6 py-2 rounded transition"
              onClick={() => navigate('/add-employee')}
            >
              Add Employee
            </button>
          </div>
        </div>
        <div className="rounded-lg border bg-white overflow-x-auto max-h-[500px] overflow-y-auto mx-auto" style={{ width: '100%', maxWidth: '1200px', minWidth: '0', touchAction: 'pan-y' }}>
          <table className="w-full text-[11px] border-separate border-spacing-0" style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', tableLayout: 'auto' }}>
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
            <thead>
              <tr className="text-gray-700 font-semibold border-b bg-gradient-to-r from-green-50 to-white">
                <th className="px-1 py-1 text-left rounded-tl-lg">Name</th>
                <th className="px-1 py-1 text-left">Code</th>
                <th className="px-1 py-1 text-left">Designation</th>
                <th className="px-1 py-1 text-left">Joining</th>
                <th className="px-1 py-1 text-left">Probation</th>
                <th className="px-1 py-1 text-left">Email</th>
                <th className="px-1 py-1 text-left">Status</th>
                <th className="px-1 py-1 text-left rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-8">Loading...</td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No employees found.</td></tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id} className="border-b last:border-b-0 hover:bg-green-50 transition-colors">
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
                          <span className="font-medium text-gray-900 leading-tight text-xs truncate">{emp.firstName} {emp.lastName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-1 py-1 max-w-xs truncate align-middle">{emp.employeeCode || '-'}</td>
                    <td className="px-1 py-1 max-w-xs truncate align-middle">{emp.designation || '-'}</td>
                    <td className="px-1 py-1 max-w-xs truncate align-middle">{emp.dateOfJoining ? new Date(emp.dateOfJoining).toLocaleDateString() : (emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : '-')}</td>
                    <td className="px-1 py-1 max-w-xs truncate align-middle">{emp.probationEndDate ? new Date(emp.probationEndDate).toLocaleDateString() : '-'}</td>
                    <td className="px-1 py-1 align-middle">{emp.email || '-'}</td>
                    <td className="px-1 py-1 align-middle">
                      {(() => {
                        const s = (emp.status || '').toLowerCase();
                        const color = s === 'active' ? 'text-green-600' : 'text-red-600';
                        const label = s || '-';
                        return <span className={`font-medium ${color}`}>{label}</span>;

                      })()}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="flex gap-2">
                        <Button
                          variant="link"
                          size="icon"
                          className="text-blue-600"
                          title="View details"
                          onClick={async () => {
                            setSelectedEmployee(emp);
                            setModalOpen(true);
                            setEditMode(false);
                            setUpdateMessage(null);
                            if (emp._id) {
                              await fetchEmployeeDetails(emp._id);
                            }
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="link"
                          size="icon"
                          className="text-green-600"
                          title="Edit details"
                          onClick={async () => {
                            setSelectedEmployee(emp);
                            setModalOpen(true);
                            setEditMode(true);
                            setUpdateMessage(null);
                            if (emp._id) {
                              await fetchEmployeeDetails(emp._id);
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
          <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" aria-describedby="employee-details-description">
            <DialogHeader className="mb-2 pb-2 border-b">
              <div id="employee-details-description" className="sr-only">
                Employee details and edit form
              </div>
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
                  <div className="text-gray-500 text-xs">{employeeDetails?.designation || ''} {employeeDetails?.department ? ` | ${employeeDetails.department}` : ''}</div>
                  <div className="text-gray-400 text-xs mt-1">{employeeDetails?.email}</div>
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
                      "firstName","lastName","phone","department","designation","role","dateOfJoining","probationEndDate","employmentType","status","reportingManager","dob","gender","bloodGroup","maritalStatus","nationality","addressLine1","addressLine2","country","state","city","zipCode","aadhaarNumber","panNumber","passportNumber","loginEnabled","isActive",
                    ].map((key) => {
                      const value = employeeDetails[key];
                      if (typeof value === "object" && value !== null) return null;
                      let inputType = "text";
                      if (["dateOfJoining", "probationEndDate", "dob"].includes(key)) inputType = "date";
                      let inputValue = formData[key] || '';
                      if (inputType === "date" && inputValue) {
                        inputValue = inputValue.slice(0, 10);
                      }
                      
                      // Handle roles array - extract first role (index 0) for display
                      if (key === 'role') {
                        const rolesArray = employeeDetails.roles || [];
                        if (rolesArray.length > 0) {
                          const firstRole = rolesArray[0];
                          if (typeof firstRole === 'string') {
                            // If it's a string (role ID), find the role name from roles array
                            const roleObj = roles.find(r => r._id === firstRole);
                            inputValue = roleObj ? roleObj.name : firstRole;
                          } else {
                            // If it's an object, use the name property
                            inputValue = firstRole.name || '';
                          }
                        } else {
                          inputValue = '';
                        }
                      }
                      const labelText = key === 'reportingManagerId' ? 'Reporting Manager' : key.replace(/([A-Z])/g, ' $1');
                      return (
                        <div key={key} className="flex flex-col mb-2">
                          <label className="font-semibold capitalize mb-1 text-gray-700">{labelText}</label>
                          {editMode ? (
                            key === 'designation' ? (
                              <div className="min-w-[200px]"><DesignationSelect value={formData.designation || ''} onChange={(v) => setFormData((fd: any) => ({ ...fd, designation: v }))} /></div>
                            ) : key === 'role' ? (
                              <div className="min-w-[200px]"><RoleSelect value={formData.role || ''} onChange={(v) => setFormData((fd: any) => ({ ...fd, role: v }))} roles={roles} /></div>
                            ) : key === 'status' ? (
                              <select
                                className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                value={(formData.status || '').toLowerCase()}
                                onChange={e => setFormData((fd: any) => ({ ...fd, status: e.target.value }))}
                              >
                                {['active','inactive','terminated'].map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            ) : (
                              <input
                                className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                type={inputType}
                                value={inputValue}
                                onChange={e => setFormData((fd: any) => ({ ...fd, [key]: e.target.value }))}
                              />
                            )
                          ) : (
                            <span className="bg-gray-50 rounded px-2 py-1 border border-gray-100">
                              {key === 'role' ? 
                                (() => {
                                  if (employeeDetails.roles && employeeDetails.roles.length > 0) {
                                    // Show only the first (assigned) role, not all roles
                                    const firstRole = employeeDetails.roles[0];
                                    if (typeof firstRole === 'string') {
                                      // If it's a string (role ID), find the role name from roles array
                                      const roleObj = roles.find(role => role._id === firstRole);
                                      return roleObj ? roleObj.name : firstRole;
                                    } else {
                                      // If it's an object, use the name property
                                      return firstRole.name || firstRole;
                                    }
                                  }
                                  return '-';
                                })() : 
                                (inputType === 'date' && value ? new Date(value).toLocaleDateString() : (value !== undefined && value !== null && value !== '' ? value.toString() : '-'))
                              }</span>
                          )}
                        </div>
                      );
                    })}
                    {/* Bank Details */}
                    {employeeDetails.bankDetails && Object.entries(employeeDetails.bankDetails).map(([k, v]) => (
                      <div key={"bankDetails" + k} className="flex flex-col">
                        <label className="font-semibold capitalize">Bank {k.replace(/([A-Z])/g, ' $1')}</label>
                        {editMode ? (
                          <input className="border rounded px-2 py-1" value={formData.bankDetails?.[k] || ''} onChange={e => setFormData((fd: any) => ({ ...fd, bankDetails: { ...fd.bankDetails, [k]: e.target.value } }))} />
                        ) : (
                          <span>{String(v ?? '-') }</span>
                        )}
                      </div>
                    ))}
                    {/* Tax Details */}
                    {employeeDetails.taxDetails && Object.entries(employeeDetails.taxDetails).map(([k, v]) => {
                      const prettyKey = k === 'ESIC' ? 'ESIC' : (k === 'UAN' ? 'UAN' : k.replace(/([A-Z])/g, ' $1'));
                      return (
                        <div key={"taxDetails" + k} className="flex flex-col">
                          <label className="font-semibold capitalize">Tax {prettyKey}</label>
                          {editMode ? (
                            <input className="border rounded px-2 py-1" value={formData.taxDetails?.[k] || ''} onChange={e => setFormData((fd: any) => ({ ...fd, taxDetails: { ...fd.taxDetails, [k]: e.target.value } }))} />
                          ) : (
                            <span>{String(v ?? '-') }</span>
                          )}
                        </div>
                      );
                    })}
                    {/* Emergency Contact */}
                    {employeeDetails.emergencyContact && Object.entries(employeeDetails.emergencyContact).map(([k, v]) => (
                      <div key={"emergencyContact" + k} className="flex flex-col">
                        <label className="font-semibold capitalize">Emergency {k.replace(/([A-Z])/g, ' $1')}</label>
                        {editMode ? (
                          <input className="border rounded px-2 py-1" value={formData.emergencyContact?.[k] || ''} onChange={e => setFormData((fd: any) => ({ ...fd, emergencyContact: { ...fd.emergencyContact, [k]: e.target.value } }))} />
                        ) : (
                          <span>{String(v ?? '-') }</span>
                        )}
                      </div>
                    ))}
                    {/* Documents */}
                    <div className="col-span-full mt-2">
                      <h4 className="font-semibold text-gray-800 mb-2">Documents</h4>
                      {Array.isArray(employeeDetails.documents) && employeeDetails.documents.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {employeeDetails.documents.map((doc: any, idx: number) => (
                            <div key={idx} className="flex flex-col items-center p-3 border border-gray-200 rounded-lg">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border mb-2">
                                {typeof doc.url === 'string' && doc.url.endsWith('.pdf') ? (
                                  <div className="text-red-500 text-xs font-medium">PDF</div>
                                ) : (
                                  <img src={doc.url} alt={doc.type || 'document'} className="w-16 h-16 object-cover rounded-lg" />
                                )}
                              </div>
                              <span className="text-xs font-medium capitalize text-gray-700">{doc.type || 'Document'}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">No documents uploaded.</div>
                      )}
                      {editMode && (
                        <div className="mt-3 flex items-center gap-3">
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={async e => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const url = await uploadFile(file);
                                setFormData((fd: any) => ({
                                  ...fd,
                                  documents: [...(fd.documents || []), { type: file.type.includes('pdf') ? 'pdf' : 'image', url }],
                                }));
                              } catch {}
                              e.currentTarget.value = '';
                            }}
                            className="text-sm"
                          />
                        </div>
                      )}
                    </div>
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
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" disabled={updateLoading}
                    onClick={async () => {
                      setUpdateLoading(true);
                      setUpdateMessage(null);
                      try {
                        const submitData: any = { ...formData };
                        let currentSelectedRole: any = null;
                        let roleChanged = false;

                        // Check if role has changed
                        if (submitData.role) {
                          const foundRole = roles.find(r => r._id === submitData.role);
                          if (foundRole) {
                            currentSelectedRole = foundRole;
                            
                            // Check if role is different from current role
                            const currentRoleId = employeeDetails?.roles?.[0]?._id || employeeDetails?.roles?.[0];
                            if (currentRoleId !== foundRole._id) {
                              roleChanged = true;
                            }
                            
                            // For general employee update, ensure only one role is assigned
                            submitData.roles = [foundRole._id]; // Single role assignment
                          }
                          delete submitData.role;
                        }

                        // Remove properties not expected by the backend or that cause issues
                        delete submitData.profilePhotoUrl; // Ensure profile photo is not sent
                        delete submitData.createdAt; // Ensure createdAt is not sent
                        delete submitData.employeeCode; // Ensure employeeCode is not sent
                        delete submitData.id; // Ensure id is not sent
                        delete submitData._id; // Ensure _id is not sent
                        delete submitData.bankDetails; // Ensure bankDetails is not sent
                        delete submitData.taxDetails; // Ensure taxDetails is not sent
                        delete submitData.emergencyContact; // Ensure emergencyContact is not sent
                        delete submitData.documents; // Ensure documents is not sent
                        delete submitData.loginEnabled; // Ensure loginEnabled is not sent
                        delete submitData.isActive; // Ensure isActive is not sent
                        delete submitData.reportingManagerId; // Ensure reportingManagerId is not sent
                        delete submitData.dob; // Ensure dob is not sent
                        delete submitData.gender; // Ensure gender is not sent
                        delete submitData.bloodGroup; // Ensure bloodGroup is not sent
                        delete submitData.maritalStatus; // Ensure maritalStatus is not sent
                        delete submitData.nationality; // Ensure nationality is not sent
                        delete submitData.addressLine1; // Ensure addressLine1 is not sent
                        delete submitData.addressLine2; // Ensure addressLine2 is not sent
                        delete submitData.country; // Ensure country is not sent
                        delete submitData.state; // Ensure state is not sent
                        delete submitData.city; // Ensure city is not sent
                        delete submitData.zipCode; // Ensure zipCode is not sent
                        delete submitData.aadhaarNumber; // Ensure aadhaarNumber is not sent
                        delete submitData.panNumber; // Ensure panNumber is not sent
                        delete submitData.passportNumber; // Ensure passportNumber is not sent

                        // If role changed, use auth/assign-role API
                        if (roleChanged && currentSelectedRole && selectedEmployee?._id) {
                          console.log('🔍 DEBUG: Assigning single role to user');
                          console.log('🔍 DEBUG: userId:', selectedEmployee._id);
                          console.log('🔍 DEBUG: roleId:', currentSelectedRole._id);
                          console.log('🔍 DEBUG: roleName:', currentSelectedRole.name);
                          
                          try {
                            const response = await assignRoleToUser(
                              selectedEmployee._id,
                              currentSelectedRole._id,
                              true // isDefault = true
                            );
                            console.log('✅ Role assigned successfully to database via auth/assign-role API:', response);
                            console.log('✅ Employee now has role:', currentSelectedRole.name);
                          } catch (error) {
                            console.error('❌ Error saving role to database:', error);
                            console.error('❌ Error response:', error.response?.data);
                            console.error('❌ Error status:', error.response?.status);
                            throw error; // Re-throw to handle in outer catch
                          }
                        }

                        // Update other employee details (excluding role as it's handled above)
                        console.log('🔍 DEBUG: Updating other employee details:', submitData);
                        await API.put(`/auth/employees/${selectedEmployee?._id}`, submitData);
                        console.log('✅ Employee details updated successfully in database');

                        setUpdateMessage('Update success!');
                        setEditMode(false);
                        setProfilePreview(null);
                        // After successful update, update the UI immediately
                        if (selectedEmployee?._id) {
                          // If role was changed, update with the new role object
                          let updatedRoles = submitData.roles;
                          if (roleChanged && currentSelectedRole) {
                            updatedRoles = [currentSelectedRole]; // Use the complete role object for UI
                          }
                          
                          // Update employeeDetails to reflect the changes immediately
                          setEmployeeDetails(prev => ({ 
                            ...prev, 
                            roles: updatedRoles,
                            designation: submitData.designation,
                            status: submitData.status
                          }));
                          
                          // Update the main employee list to reflect the role change
                          setEmployees(prev => prev.map(emp => 
                            emp._id === selectedEmployee?._id 
                              ? { 
                                  ...emp, 
                                  designation: submitData.designation, 
                                  status: submitData.status, 
                                  roles: updatedRoles 
                                } 
                              : emp
                          ));
                          
                          // Re-fetch employee details to ensure we have the latest data from server
                          await fetchEmployeeDetails(selectedEmployee._id);
                        }
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
                    className="ml-2 px-4 py-2 rounded border"
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
            <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button key={p} variant={p === page ? 'default' : 'ghost'} size="sm" className="mx-1" onClick={() => setPage(p)}>{p}</Button>
            ))}
            <Button variant="ghost" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeList;