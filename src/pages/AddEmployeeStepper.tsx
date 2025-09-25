
import { useState, useEffect } from "react";
import { uploadFile } from "@/api/uploadFile";
import { useNavigate } from "react-router-dom";
import { getRoles } from "@/api/roles";
import API from "@/api/auth";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

// Compact Input Component
const Input = ({ label, type = "text", value, onChange, fullWidth = false }: any) => (
  <div className={`flex flex-col ${fullWidth ? "md:col-span-2" : ""}`}>
    <label className="mb-1 text-xs font-medium text-gray-600">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm shadow-sm 
                 focus:border-green-500 focus:ring-1 focus:ring-green-200 transition"
    />
  </div>
);

const AddEmployeeStepper = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [form, setForm] = useState<any>({
    firstName: "", lastName: "", email: "", password: "", phone: "", department: "", designation: "",
    grade: "", dateOfJoining: "", employmentType: "", reportingManager: "", probationEndDate: "",
    isActive: true, dob: "", gender: "", bloodGroup: "", maritalStatus: "", nationality: "", country: "",
    state: "", city: "", zipCode: "", passportNo: "", addressLine1: "", addressLine2: "", aadhaarNo: "",
    panNo: "", profilePhotoUrl: "",
    bankDetails: { bankName: "", accountNumber: "", ifscCode: "", branch: "" },
    taxDetails: { taxRegime: "", UAN: "", ESIC: "" },
    emergencyContact: { name: "", relationship: "", phone: "" },
    documents: [],
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [docType, setDocType] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docUploading, setDocUploading] = useState(false);

  // Roles dropdown state
  const [roles, setRoles] = useState<any[]>([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    getRoles().then(setRoles).catch(() => setRoles([]));
  }, []);

  const steps = [
    "Employee Details",
    "Personal Information",
    "Finance & Emergency",
    "Uploads & Admin",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center py-10">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8 md:p-10">

        {/* Breadcrumb Navigation */}
        <h1 className="text-2xl font-bold text-green-700 mb-4">Add New Employee</h1>
        <div className="flex items-center space-x-2 text-sm mb-8">
          {steps.map((s, idx) => (
            <div key={idx} className="flex items-center">
              <span
                className={`${
                  step === idx
                    ? "font-semibold text-gray-900"
                    : "text-gray-400 hover:text-green-600 cursor-pointer"
                }`}
                onClick={() => setStep(idx)}
              >
                {s}
              </span>
              {idx < steps.length - 1 && (
                <span className="mx-2 text-gray-300">{">"}</span>
              )}
            </div>
          ))}
        </div>

        {/* Step 0 – Employee Details */}
        {step === 0 && (
          <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="First Name" value={form.firstName} onChange={(e:any)=>setForm({...form, firstName:e.target.value})}/>
            <Input label="Last Name" value={form.lastName} onChange={(e:any)=>setForm({...form, lastName:e.target.value})}/>
            <Input label="Email" type="email" value={form.email} onChange={(e:any)=>setForm({...form, email:e.target.value})}/>
            <Input label="Phone Number" value={form.phone} onChange={(e:any)=>setForm({...form, phone:e.target.value})}/>
            <Input label="Password" type="password" value={form.password} onChange={(e:any)=>setForm({...form, password:e.target.value})}/>
            <Input label="Department" value={form.department} onChange={(e:any)=>setForm({...form, department:e.target.value})}/>
            <Input label="Designation" value={form.designation} onChange={(e:any)=>setForm({...form, designation:e.target.value})}/>
            <Input label="Grade" value={form.grade} onChange={(e:any)=>setForm({...form, grade:e.target.value})}/>
            {/* Roles Dropdown */}
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium text-gray-600">Role</label>
              {roles.length === 0 ? (
                <div className="text-xs text-gray-400 px-2 py-2 border rounded bg-gray-50">No roles found</div>
              ) : (
                <Select value={role} onValueChange={val => { setRole(val); setForm({ ...form, role: val }); }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.filter((r:any) => (r.name || r.value)).map((r:any) => (
                      <SelectItem key={r.id || r._id || r.value || r.name} value={r.name || r.value}>{r.name || r.value}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            {/* Employment Type Dropdown */}
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium text-gray-600">Employment Type</label>
              <Select value={form.employmentType} onValueChange={val => setForm({...form, employmentType: val})}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Employment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="intern">Intern</SelectItem>
                  <SelectItem value="consultant">Consultant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input label="Reporting Manager" value={form.reportingManager} onChange={(e:any)=>setForm({...form, reportingManager:e.target.value})}/>
            <Input label="Date of Joining" type="date" value={form.dateOfJoining} onChange={(e:any)=>setForm({...form, dateOfJoining:e.target.value})}/>
            <Input label="Probation End Date" type="date" value={form.probationEndDate} onChange={(e:any)=>setForm({...form, probationEndDate:e.target.value})}/>
            {/* Status Dropdown */}
            <div className="flex flex-col col-span-2">
              <label className="mb-1 text-xs font-medium text-gray-600">Status</label>
              <Select value={form.status || "active"} onValueChange={val => setForm({...form, status: val})}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        )}

        {/* Step 1 – Personal Info */}
        {step === 1 && (
          <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Date of Birth" type="date" value={form.dob} onChange={(e:any)=>setForm({...form, dob:e.target.value})}/>
            {/* Gender Dropdown */}
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium text-gray-600">Gender</label>
              <Select value={form.gender} onValueChange={val => setForm({...form, gender: val})}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input label="Blood Group" value={form.bloodGroup} onChange={(e:any)=>setForm({...form, bloodGroup:e.target.value})}/>
            {/* Marital Status Dropdown */}
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium text-gray-600">Marital Status</label>
              <Select value={form.maritalStatus} onValueChange={val => setForm({...form, maritalStatus: val})}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Marital Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input label="Country" value={form.country} onChange={(e:any)=>setForm({...form, country:e.target.value})}/>
            <Input label="Nationality" value={form.nationality} onChange={(e:any)=>setForm({...form, nationality:e.target.value})}/>
            <Input label="State" value={form.state} onChange={(e:any)=>setForm({...form, state:e.target.value})}/>
            <Input label="City" value={form.city} onChange={(e:any)=>setForm({...form, city:e.target.value})}/>
            <Input label="Zip Code" value={form.zipCode} onChange={(e:any)=>setForm({...form, zipCode:e.target.value})}/>
            <Input label="Passport No" value={form.passportNo} onChange={(e:any)=>setForm({...form, passportNo:e.target.value})}/>
            <Input fullWidth label="Address Line 1" value={form.addressLine1} onChange={(e:any)=>setForm({...form, addressLine1:e.target.value})}/>
            <Input fullWidth label="Address Line 2 (optional)" value={form.addressLine2} onChange={(e:any)=>setForm({...form, addressLine2:e.target.value})}/>
            <Input label="Aadhaar Number" value={form.aadhaarNo} onChange={(e:any)=>setForm({...form, aadhaarNo:e.target.value})}/>
            <Input label="PAN Number" value={form.panNo} onChange={(e:any)=>setForm({...form, panNo:e.target.value})}/>
          </form>
        )}

        {/* Step 2 – Finance & Emergency */}
        {step === 2 && (
          <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Bank Name" value={form.bankDetails.bankName} onChange={(e:any)=>setForm({...form, bankDetails:{...form.bankDetails, bankName:e.target.value}})}/>
            <Input label="Account Number" value={form.bankDetails.accountNumber} onChange={(e:any)=>setForm({...form, bankDetails:{...form.bankDetails, accountNumber:e.target.value}})}/>
            <Input label="IFSC Code" value={form.bankDetails.ifscCode} onChange={(e:any)=>setForm({...form, bankDetails:{...form.bankDetails, ifscCode:e.target.value}})}/>
            <Input label="Branch" value={form.bankDetails.branch} onChange={(e:any)=>setForm({...form, bankDetails:{...form.bankDetails, branch:e.target.value}})}/>
            {/* Tax Regime Dropdown */}
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium text-gray-600">Tax Regime</label>
              <Select value={form.taxDetails.taxRegime} onValueChange={val => setForm({...form, taxDetails:{...form.taxDetails, taxRegime: val}})}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Tax Regime" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="old">Old</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input label="UAN" value={form.taxDetails.UAN} onChange={(e:any)=>setForm({...form, taxDetails:{...form.taxDetails, UAN:e.target.value}})}/>
            <Input label="ESIC" value={form.taxDetails.ESIC} onChange={(e:any)=>setForm({...form, taxDetails:{...form.taxDetails, ESIC:e.target.value}})}/>
            <Input label="Emergency Contact Name" value={form.emergencyContact.name} onChange={(e:any)=>setForm({...form, emergencyContact:{...form.emergencyContact, name:e.target.value}})}/>
            <Input label="Relationship" value={form.emergencyContact.relationship} onChange={(e:any)=>setForm({...form, emergencyContact:{...form.emergencyContact, relationship:e.target.value}})}/>
            <Input label="Phone" value={form.emergencyContact.phone} onChange={(e:any)=>setForm({...form, emergencyContact:{...form.emergencyContact, phone:e.target.value}})}/>
          </form>
        )}

        {/* Step 3 – Uploads & Admin */}
        {step === 3 && (
          <div>
            {/* Profile Photo Upload */}
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Profile Photo</h2>
            <div className="flex items-center gap-6 mb-8">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-100 rounded border border-dashed flex items-center justify-center mb-2">
                  {profilePreview || form.profilePhotoUrl ? (
                    <img src={profilePreview || form.profilePhotoUrl} alt="Profile" className="w-20 h-20 object-cover rounded" />
                  ) : (
                    <span className="text-gray-400 text-sm">Img</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="profile-upload"
                  onChange={async e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => setProfilePreview(ev.target?.result as string);
                      reader.readAsDataURL(file);
                      try {
                        const url = await uploadFile(file);
                        setForm((f:any) => ({ ...f, profilePhotoUrl: url }));
                      } catch {}
                    }
                  }}
                />
                <label htmlFor="profile-upload" className="bg-gray-200 px-3 py-1 rounded text-sm cursor-pointer">
                  Choose File
                </label>
                <span className="text-xs text-gray-400 mt-1">Square image, under 100KB</span>
              </div>
            </div>

            {/* Document Upload */}
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Documents</h2>
            <div className="flex items-center gap-2 mb-4">
              <select className="border rounded px-2 py-1 text-sm" value={docType} onChange={e => setDocType(e.target.value)}>
                <option value="">Select Type</option>
                <option value="aadhaar">Aadhaar</option>
                <option value="pan">PAN</option>
                <option value="passport">Passport</option>
                <option value="driving-license">Driving License</option>
                <option value="voter-id">Voter ID</option>
                <option value="other">Other</option>
              </select>
              <input type="file" className="border rounded px-2 py-1 text-sm" onChange={e => setDocFile(e.target.files?.[0] || null)} />
              <button
                type="button"
                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                disabled={!docType || !docFile || docUploading}
                onClick={async () => {
                  if (!docType || !docFile) return;
                  setDocUploading(true);
                  try {
                    const url = await uploadFile(docFile);
                    setForm((f:any) => ({
                      ...f,
                      documents: [...f.documents, { type: docType, url, uploadedAt: new Date().toISOString() }],
                    }));
                    setDocType("");
                    setDocFile(null);
                  } finally {
                    setDocUploading(false);
                  }
                }}
              >
                {docUploading ? "Uploading..." : "Upload"}
              </button>
            </div>

            {/* Documents Preview */}
            <div className="flex gap-6 mt-4 flex-wrap">
              {form.documents.length > 0 ? (
                form.documents.map((doc:any, idx:number) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center border mb-1">
                      {doc.url.endsWith(".pdf") ? (
                        <img src="/pdf-icon.png" alt="PDF" className="w-8 h-8" />
                      ) : (
                        <img src={doc.url} alt={doc.type} className="w-16 h-16 object-cover rounded" />
                      )}
                    </div>
                    <span className="text-xs mt-1 capitalize">{doc.type}</span>
                  </div>
                ))
              ) : (
                <span className="text-gray-400 text-sm">No documents uploaded yet.</span>
              )}
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-between mt-10">
          <button
            className="px-6 py-2 rounded-lg border text-gray-700 bg-white hover:bg-gray-50 transition"
            disabled={step === 0}
            onClick={() => setStep(s => Math.max(0, s - 1))}
          >
            Previous
          </button>
          {step < steps.length - 1 ? (
            <button
              className="px-6 py-2 rounded-lg bg-green-600 text-white shadow hover:bg-green-700 transition"
              onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
            >
              Next
            </button>
          ) : (
            <button
              className="px-6 py-2 rounded-lg bg-green-600 text-white shadow hover:bg-green-700 transition disabled:opacity-60"
              disabled={loading}
              onClick={async (e) => {
                e.preventDefault();
                setLoading(true);
                setError("");
                try {
                  // Prepare payload as per schema
                  const payload = {
                    ...form,
                    taxDetails: {
                      ...form.taxDetails,
                      UAN: form.taxDetails.UAN,
                      ESIC: form.taxDetails.ESIC,
                    },
                    role: role,
                  };
                  await API.post("/auth/employees", payload);
                  setSuccess(true);
                } catch (err: any) {
                  setError(err?.response?.data?.message || "Failed to add employee");
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? "Adding..." : "Add Employee"}
              </button>
            )}
            {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
          </div>
      </div>
    </div>
  );
};

export default AddEmployeeStepper;
