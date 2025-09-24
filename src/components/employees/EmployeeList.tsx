import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, MoreVertical } from "lucide-react";
import { Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Total Employees - {total}</CardTitle>
      </CardHeader>
      <CardContent>
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline" className={`min-w-[70px] px-2 py-1 ${emp.status === 'active' ? 'text-green-600 border-green-200' : 'text-red-500 border-red-200'}`}>{emp.status === 'active' ? 'Active' : 'Inactive'}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleStatusChange(emp._id, 'active')} className="text-green-600">Active</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(emp._id, 'inactive')} className="text-red-500">Inactive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <Button
                        variant="link"
                        size="icon"
                        className="text-blue-600"
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
            <DialogHeader>
              <DialogTitle>Employee Details</DialogTitle>
            </DialogHeader>
            {selectedEmployee && (
              <div className="space-y-4 text-sm p-2 md:p-4 bg-white rounded-lg shadow-md">
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center mb-4">
                  <div className="relative w-24 h-24 mb-2">
                    <img
                      src={profilePreview || employeeDetails?.profilePhotoUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent((employeeDetails?.firstName || '') + ' ' + (employeeDetails?.lastName || ''))}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border shadow"
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
                  <div className="text-xs text-gray-500">Profile Photo</div>
                </div>
                {loadingDetails ? (
                  <div>Loading...</div>
                ) : employeeDetails ? (
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <label className="font-semibold capitalize mb-1 text-gray-700">{key.replace(/([A-Z])/g, ' $1')}</label>
                          {editMode ? (
                            <input
                              className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                              type={inputType}
                              value={inputValue}
                              onChange={e => setFormData((fd: any) => ({ ...fd, [key]: e.target.value }))}
                            />
                          ) : (
                            <span className="bg-gray-50 rounded px-2 py-1 border border-gray-100">{inputType === 'date' && value ? new Date(value).toLocaleDateString() : (value !== undefined && value !== null && value !== '' ? value.toString() : '-')}</span>
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
                          <span>{v || '-'}</span>
                        )}
                      </div>
                    ))}
                    {/* Tax Details */}
                    {employeeDetails.taxDetails && Object.entries(employeeDetails.taxDetails).map(([k, v]) => (
                      <div key={"taxDetails" + k} className="flex flex-col">
                        <label className="font-semibold capitalize">Tax {k.replace(/([A-Z])/g, ' $1')}</label>
                        {editMode ? (
                          <input className="border rounded px-2 py-1" value={formData.taxDetails?.[k] || ''} onChange={e => setFormData((fd: any) => ({ ...fd, taxDetails: { ...fd.taxDetails, [k]: e.target.value } }))} />
                        ) : (
                          <span>{v || '-'}</span>
                        )}
                      </div>
                    ))}
                    {/* Emergency Contact */}
                    {employeeDetails.emergencyContact && Object.entries(employeeDetails.emergencyContact).map(([k, v]) => (
                      <div key={"emergencyContact" + k} className="flex flex-col">
                        <label className="font-semibold capitalize">Emergency {k.replace(/([A-Z])/g, ' $1')}</label>
                        {editMode ? (
                          <input className="border rounded px-2 py-1" value={formData.emergencyContact?.[k] || ''} onChange={e => setFormData((fd: any) => ({ ...fd, emergencyContact: { ...fd.emergencyContact, [k]: e.target.value } }))} />
                        ) : (
                          <span>{v || '-'}</span>
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
              {employeeDetails && !editMode && (
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => setEditMode(true)}>Update</button>
              )}
              {editMode && (
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  disabled={updateLoading}
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
              )}
              {editMode && (
                <button className="ml-2 px-4 py-2 rounded border" onClick={() => { setEditMode(false); setFormData(employeeDetails); setProfilePreview(null); }}>Cancel</button>
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