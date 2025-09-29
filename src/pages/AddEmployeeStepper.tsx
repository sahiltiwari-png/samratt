
import { useState, useEffect } from "react";
import { Calendar, Check, ChevronRight, ChevronDown, X as XIcon, Search as SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";



import { uploadFile } from "../api/uploadFile";
import API from "../api/auth";
import { getRoles } from "../api/roles";



// Compact Input Component
const Input = ({ label, type = "text", value, onChange, fullWidth = false, placeholder = "", onlyNumber = false }: any) => (
  <div className={`flex flex-col ${fullWidth ? "md:col-span-2" : ""}`}>
    <label className="mb-2 text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={e => {
          if (onlyNumber) {
            const val = e.target.value;
            if (/^\d*$/.test(val)) {
              onChange(e);
            }
          } else {
            onChange(e);
          }
        }}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm bg-white
                   focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-colors
                   placeholder-gray-400"
      />
      {type === "date" && (
        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      )}
    </div>
  </div>
);

// Select Component
const Select = ({ label, value, onChange, options, placeholder = "Select..." }: any) => (
  <div className="flex flex-col">
    <label className="mb-2 text-sm font-medium text-gray-700">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm bg-white
                 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-colors"
    >
      <option value="">{placeholder}</option>
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// Designation master list
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

const DesignationSelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = DESIGNATION_OPTIONS.filter(opt => opt.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="flex flex-col">
      <label className="mb-2 text-sm font-medium text-gray-700">Designation</label>
      <div className="relative">
        <input 
          value={value}
          onChange={e => { onChange(e.target.value); setQuery(e.target.value); setOpen(true); }}
          onClick={() => setOpen(o => !o)}
          placeholder="Select designation" 
          className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 placeholder-gray-400"
        />
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
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
              filtered.map(opt => (
                <button
                  key={opt}
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm hover:bg-green-50"
                  onClick={() => { onChange(opt); setQuery(opt); setOpen(false); }}
                >
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

const RoleSelect = ({ value, onChange, roles }: { value: string; onChange: (v: string) => void; roles: any[] }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = roles.filter(role => role.name.toLowerCase().includes(query.toLowerCase()));
  
  // Find the selected role name based on the role ID
  const selectedRole = roles.find(role => role._id === value);
  const displayValue = selectedRole ? selectedRole.name : "";
  
  return (
    <div className="flex flex-col">
      <label className="mb-2 text-sm font-medium text-gray-700">Role</label>
      <div className="relative">
        <input 
          value={query || displayValue}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onClick={() => setOpen(o => !o)}
          placeholder="Select role" 
          className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 placeholder-gray-400"
        />
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
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
                <button
                  key={role.id}
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm hover:bg-green-50"
                  onClick={() => { onChange(role._id); setQuery(""); setOpen(false); }}
                >
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

const AddEmployeeStepper = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [form, setForm] = useState<any>({
    firstName: "", lastName: "", email: "", password: "", phone: "", department: "", designation: "",
    grade: "", dateOfJoining: "", employmentType: "full-time", reportingManager: "", probationEndDate: "",
    isActive: true, dob: "", gender: "", bloodGroup: "", maritalStatus: "", nationality: "", country: "",
    state: "", city: "", zipCode: "", passportNo: "", addressLine1: "", addressLine2: "", aadhaarNo: "",
    panNo: "", profilePhotoUrl: "", status: "active", role: "",
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

  useEffect(() => {
    getRoles().then(setRoles).catch(() => setRoles([]));
  }, []);

  const steps = [
    { title: "Employee Details", subtitle: "Fill in Employee details" },
    { title: "Personal Information", subtitle: "Personal details" },
    { title: "Finance & Emergency", subtitle: "Financial information" },
    { title: "Admin Details", subtitle: "Upload documents" },
  ];

  const employmentTypeOptions = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "intern", label: "Intern" },
    { value: "consultant", label: "Consultant" }
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer-not-to-say", label: "Prefer not to say" }
  ];

  const maritalStatusOptions = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widowed" }
  ];

  const taxRegimeOptions = [
    { value: "old", label: "Old" },
    { value: "new", label: "New" }
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Employee Added Successfully!</h2>
          <p className="text-gray-600 mb-6">The employee has been added to the system.</p>
          <button
            onClick={() => {
              setSuccess(false);
              setStep(0);
              setForm({
                firstName: "", lastName: "", email: "", password: "", phone: "", department: "", designation: "",
                grade: "", dateOfJoining: "", employmentType: "full-time", reportingManager: "", probationEndDate: "",
                isActive: true, dob: "", gender: "", bloodGroup: "", maritalStatus: "", nationality: "", country: "",
                state: "", city: "", zipCode: "", passportNo: "", addressLine1: "", addressLine2: "", aadhaarNo: "",
                panNo: "", profilePhotoUrl: "", status: "active", role: "",
                bankDetails: { bankName: "", accountNumber: "", ifscCode: "", branch: "" },
                taxDetails: { taxRegime: "", UAN: "", ESIC: "" },
                emergencyContact: { name: "", relationship: "", phone: "" },
                documents: [],
              });
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
          >
            Add Another Employee
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto pt-8 pb-16">
        
        {/* Breadcrumb Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="px-8 py-4">
            <div className="flex items-center space-x-2 text-sm">
              {steps.map((s, idx) => (
                <div key={idx} className="flex items-center">
                  <span
                    className={`${
                      step === idx
                        ? "font-medium text-gray-900"
                        : step > idx
                        ? "text-green-600"
                        : "text-gray-400"
                    } cursor-pointer hover:text-green-600 transition-colors`}
                    onClick={() => setStep(idx)}
                  >
                    {s.title}
                  </span>
                  {idx < steps.length - 1 && (
                    <ChevronRight className="mx-3 w-4 h-4 text-gray-300" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-8 py-8 relative">
            <button
              type="button"
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
              onClick={() => navigate('/employees')}
              aria-label="Close"
              title="Close"
            >
              <XIcon className="w-5 h-5" />
            </button>
            
            {/* Step Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                {steps[step].title}
              </h1>
              <p className="text-gray-600">{steps[step].subtitle}</p>
            </div>

            {/* Step 0 – Employee Details */}
            {step === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="First Name" 
                  value={form.firstName} 
                  onChange={(e:any)=>setForm({...form, firstName:e.target.value})}
                />
                <Input 
                  label="Last Name" 
                  value={form.lastName} 
                  onChange={(e:any)=>setForm({...form, lastName:e.target.value})}
                />
                <Input 
                  label="Email" 
                  type="email" 
                  value={form.email} 
                  onChange={(e:any)=>setForm({...form, email:e.target.value})}
                />
                <Input 
                  label="Phone Number" 
                  value={form.phone} 
                  onlyNumber
                  onChange={(e:any)=>setForm({...form, phone:e.target.value})}
                />
                <Input 
                  label="Password" 
                  type="password" 
                  value={form.password} 
                  onChange={(e:any)=>setForm({...form, password:e.target.value})}
                />
                <DesignationSelect
                  value={form.designation}
                  onChange={(v:string)=>setForm({...form, designation:v})}
                />
                <RoleSelect
                  value={form.role}
                  onChange={(v:string)=>setForm({...form, role:v})}
                  roles={roles}
                />
                <Select
                  label="Employment Type"
                  value={form.employmentType}
                  onChange={(val: string) => setForm({...form, employmentType: val})}
                  options={employmentTypeOptions}
                  placeholder="Select Employment Type"
                />
                <Input 
                  label="Reporting Manager" 
                  value={form.reportingManager} 
                  onChange={(e:any)=>setForm({...form, reportingManager:e.target.value})}
                />
                <Input 
                  label="Date of Joining" 
                  type="date" 
                  value={form.dateOfJoining} 
                  onChange={(e:any)=>setForm({...form, dateOfJoining:e.target.value})}
                />
                <Input 
                  label="Probation End Date" 
                  type="date" 
                  value={form.probationEndDate} 
                  onChange={(e:any)=>setForm({...form, probationEndDate:e.target.value})}
                />
                
                {/* Active Checkbox */}
                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    id="active"
                    checked={form.status === "active"}
                    onChange={(e) => setForm({...form, status: e.target.checked ? "active" : "inactive"})}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>
              </div>
            )}

            {/* Step 1 – Personal Info */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Date of Birth" 
                  type="date" 
                  value={form.dob} 
                  onChange={(e:any)=>setForm({...form, dob:e.target.value})}
                />
                <Select
                  label="Gender"
                  value={form.gender}
                  onChange={(val: string) => setForm({...form, gender: val})}
                  options={genderOptions}
                  placeholder="Select Gender"
                />
                <Input 
                  label="Blood Group" 
                  value={form.bloodGroup} 
                  onChange={(e:any)=>setForm({...form, bloodGroup:e.target.value})}
                />
                <Select
                  label="Marital Status"
                  value={form.maritalStatus}
                  onChange={(val: string) => setForm({...form, maritalStatus: val})}
                  options={maritalStatusOptions}
                  placeholder="Select Marital Status"
                />
                <Input 
                  label="Country" 
                  value={form.country} 
                  onChange={(e:any)=>setForm({...form, country:e.target.value})}
                />
                <Input 
                  label="Nationality" 
                  value={form.nationality} 
                  onChange={(e:any)=>setForm({...form, nationality:e.target.value})}
                />
                <Input 
                  label="State" 
                  value={form.state} 
                  onChange={(e:any)=>setForm({...form, state:e.target.value})}
                />
                <Input 
                  label="City" 
                  value={form.city} 
                  onChange={(e:any)=>setForm({...form, city:e.target.value})}
                />
                <Input 
                  label="Zip Code" 
                  value={form.zipCode} 
                  onlyNumber
                  onChange={(e:any)=>setForm({...form, zipCode:e.target.value})}
                />
                <Input 
                  label="Passport No" 
                  value={form.passportNo} 
                  onChange={(e:any)=>setForm({...form, passportNo:e.target.value})}
                />
                <Input 
                  fullWidth 
                  label="Address Line 1" 
                  value={form.addressLine1} 
                  onChange={(e:any)=>setForm({...form, addressLine1:e.target.value})}
                />
                <Input 
                  fullWidth 
                  label="Address Line 2 (optional)" 
                  value={form.addressLine2} 
                  onChange={(e:any)=>setForm({...form, addressLine2:e.target.value})}
                />
                <Input 
                  label="Aadhaar Number" 
                  value={form.aadhaarNo} 
                  onlyNumber
                  onChange={(e:any)=>setForm({...form, aadhaarNo:e.target.value})}
                />
                <Input 
                  label="PAN Number" 
                  value={form.panNo} 
                  onChange={(e:any)=>setForm({...form, panNo:e.target.value})}
                />
              </div>
            )}

            {/* Step 2 – Finance & Emergency */}
            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                      label="Bank Name" 
                      value={form.bankDetails.bankName} 
                      onChange={(e:any)=>setForm({...form, bankDetails:{...form.bankDetails, bankName:e.target.value}})}
                    />
                    <Input 
                      label="Account Number" 
                      value={form.bankDetails.accountNumber} 
                      onlyNumber
                      onChange={(e:any)=>setForm({...form, bankDetails:{...form.bankDetails, accountNumber:e.target.value}})}
                    />
                    <Input 
                      label="IFSC Code" 
                      value={form.bankDetails.ifscCode} 
                      onChange={(e:any)=>setForm({...form, bankDetails:{...form.bankDetails, ifscCode:e.target.value}})}
                    />
                    <Input 
                      label="Branch" 
                      value={form.bankDetails.branch} 
                      onChange={(e:any)=>setForm({...form, bankDetails:{...form.bankDetails, branch:e.target.value}})}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Tax Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                      label="Tax Regime"
                      value={form.taxDetails.taxRegime}
                      onChange={(val: string) => setForm({...form, taxDetails:{...form.taxDetails, taxRegime: val}})}
                      options={taxRegimeOptions}
                      placeholder="Select Tax Regime"
                    />
                    <Input 
                      label="UAN" 
                      value={form.taxDetails.UAN} 
                      onlyNumber
                      onChange={(e:any)=>setForm({...form, taxDetails:{...form.taxDetails, UAN:e.target.value}})}
                    />
                    <Input 
                      label="ESIC" 
                      value={form.taxDetails.ESIC} 
                      onlyNumber
                      onChange={(e:any)=>setForm({...form, taxDetails:{...form.taxDetails, ESIC:e.target.value}})}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                      label="Emergency Contact Name" 
                      value={form.emergencyContact.name} 
                      onChange={(e:any)=>setForm({...form, emergencyContact:{...form.emergencyContact, name:e.target.value}})}
                    />
                    <Input 
                      label="Relationship" 
                      value={form.emergencyContact.relationship} 
                      onChange={(e:any)=>setForm({...form, emergencyContact:{...form.emergencyContact, relationship:e.target.value}})}
                    />
                    <Input 
                      label="Phone" 
                      value={form.emergencyContact.phone} 
                      onlyNumber
                      onChange={(e:any)=>setForm({...form, emergencyContact:{...form.emergencyContact, phone:e.target.value}})}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 – Admin Details */}
            {step === 3 && (
              <div className="space-y-8">
                {/* Profile Photo Upload */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Photo</h3>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-3">
                        {profilePreview || form.profilePhotoUrl ? (
                          <img 
                            src={profilePreview || form.profilePhotoUrl} 
                            alt="Profile" 
                            className="w-24 h-24 object-cover rounded-lg" 
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">Upload Photo</span>
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
                            setProfilePreview(URL.createObjectURL(file));
                            try {
                              const url = await uploadFile(file);
                              setForm((f:any) => ({ ...f, profilePhotoUrl: url }));
                            } catch {}
                          }
                        }}
                      />
                      <label 
                        htmlFor="profile-upload" 
                        className="bg-green-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-green-700 transition"
                      >
                        Choose File
                      </label>
                      <span className="text-xs text-gray-400 mt-2">Square image, under 100KB</span>
                    </div>
                  </div>
                </div>

                {/* Document Upload */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
                  <div className="flex flex-wrap items-end gap-4 mb-6">
                    <div className="flex flex-col">
                      <label className="mb-2 text-sm font-medium text-gray-700">Document Type</label>
                      <select 
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100" 
                        value={docType} 
                        onChange={e => setDocType(e.target.value)}
                      >
                        <option value="">Select Type</option>
                        <option value="aadhaar">Aadhaar</option>
                        <option value="pan">PAN</option>
                        <option value="passport">Passport</option>
                        <option value="driving-license">Driving License</option>
                        <option value="voter-id">Voter ID</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="mb-2 text-sm font-medium text-gray-700">Choose File</label>
                      <input 
                        type="file" 
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100" 
                        onChange={async e => {
                          const file = e.target.files?.[0] || null;
                          setDocFile(file);
                          if (file && docType) {
                            setDocUploading(true);
                            try {
                              const url = await uploadFile(file);
                              setForm((f:any) => ({
                                ...f,
                                documents: [...f.documents, { type: docType, url, uploadedAt: new Date().toISOString() }],
                              }));
                              setDocType("");
                              setDocFile(null);
                            } finally {
                              setDocUploading(false);
                            }
                          }
                        }} 
                      />
                    </div>
                    
                    {/* Upload button removed: upload happens on file select */}
                  </div>

                  {/* Documents Preview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {form.documents.length > 0 ? (
                      form.documents.map((doc:any, idx:number) => (
                        <div key={idx} className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border mb-2">
                            {doc.url.endsWith(".pdf") ? (
                              <div className="text-red-500 text-xs font-medium">PDF</div>
                            ) : (
                              <img src={doc.url} alt={doc.type} className="w-16 h-16 object-cover rounded-lg" />
                            )}
                          </div>
                          <span className="text-xs font-medium capitalize text-gray-700">{doc.type}</span>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8">
                        <span className="text-gray-400 text-sm">No documents uploaded yet.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between items-center px-8 py-6 bg-gray-50 rounded-b-lg">
            <button
              className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={step === 0}
              onClick={() => setStep(s => Math.max(0, s - 1))}
            >
              Previous
            </button>
            
            <div className="flex items-center">
              {error && (
                <div className="text-red-500 text-sm mr-4">{error}</div>
              )}
              
              {step < steps.length - 1 ? (
                <button
                  className="px-8 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                  onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
                >
                  Save and continue
                </button>
              ) : (
                <button
                  className="px-8 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                  onClick={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    setError("");
                    try {
                      let profilePhotoUrl = form.profilePhotoUrl;
                      // If profilePreview is a File (not a URL), upload it
                      if (profilePreview && profilePreview.startsWith("blob:")) {
                        // Find the file input and upload the file again (simulate real upload)
                        const fileInput = document.getElementById("profile-upload") as HTMLInputElement;
                        if (fileInput && fileInput.files && fileInput.files[0]) {
                          profilePhotoUrl = await uploadFile(fileInput.files[0]);
                        }
                      }

                      // Upload any documents with blob: URLs
                      const documents = await Promise.all(
                        form.documents.map(async (doc: any) => {
                          if (doc.url && doc.url.startsWith("blob:")) {
                            // Try to find the file input (not perfect, but for demo/mock)
                            if (doc.file) {
                              const url = await uploadFile(doc.file);
                              return { ...doc, url };
                            }
                          }
                          return doc;
                        })
                      );

                      const payload = {
                        ...form,
                        profilePhotoUrl,
                        documents,
                        taxDetails: {
                          ...form.taxDetails,
                          UAN: form.taxDetails.UAN,
                          ESIC: form.taxDetails.ESIC,
                        },
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeStepper;