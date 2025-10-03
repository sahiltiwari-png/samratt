import { useEffect, useState, useContext, useRef } from "react";
import { getOrganizations } from "@/api/organizations";
import { getDashboardStats } from "@/api/dashboard";
import { getHolidayCalendar, saveHolidayCalendar } from "@/api/holidayCalendar";
import { uploadFile } from "@/api/uploadFile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OrgSearchContext } from "@/components/layout/MainLayout";
import { Plus, Building, Users, X, LogIn, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import EmployeeList from "@/components/employees/EmployeeList";
const Dashboard = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Dashboard stats state for companyAdmin
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState("");
  const { search } = useContext(OrgSearchContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [calendarData, setCalendarData] = useState<{calendarFile?: string; calendarFileName?: string} | null>(null);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.role === 'superAdmin') {
      const fetchOrganizations = async () => {
        try {
          setLoading(true);
          const data = await getOrganizations();
          setOrganizations(Array.isArray(data) ? data : (Array.isArray(data?.organizations) ? data.organizations : []));
        } catch (err) {
          setError("Failed to load organizations");
        } finally {
          setLoading(false);
        }
      };
      fetchOrganizations();
    }
  }, [user?.role]);

  // Company Admin Dashboard UI (matches provided image)
  useEffect(() => {
    if (user?.role === 'companyAdmin') {
      setDashboardLoading(true);
      setDashboardError("");
      getDashboardStats()
        .then((data) => setDashboardStats(data))
        .catch(() => setDashboardError("Failed to load dashboard stats"))
        .finally(() => setDashboardLoading(false));
      // Fetch holiday calendar with organizationId
      setCalendarLoading(true);
      if (user?.organizationId) {
        getHolidayCalendar(user.organizationId)
          .then((response) => {
            if (response?.data) {
              setCalendarData(response.data);
            } else {
              setCalendarData(null);
            }
          })
          .catch((error) => {
            console.error("Error fetching holiday calendar:", error);
            setCalendarData(null);
          })
          .finally(() => setCalendarLoading(false));
      } else {
        console.error("Missing organizationId for holiday calendar");
        setCalendarLoading(false);
      }
    }
  }, [user?.role, user?.organizationId]);

  const handleCalendarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user?.organizationId) {
      console.log('No file selected or missing organizationId');
      return;
    }
    setCalendarLoading(true);
    try {
      const file = e.target.files[0];
      console.log('Selected file:', file);
      // Reset the input so the same file can be uploaded again
      if (fileInputRef.current) fileInputRef.current.value = "";
      console.log('Calling uploadFile API...');
      const url = await uploadFile(file);
      console.log('uploadFile API returned URL:', url);
      // Send the full image URL as calendarFileName
      const saveRes = await saveHolidayCalendar(user.organizationId, url);
      console.log('saveHolidayCalendar response:', saveRes);
      setCalendarUrl(url);
    } catch (err) {
      console.error('Calendar upload error:', err);
      alert('Upload failed: ' + (err?.message || err));
    } finally {
      setCalendarLoading(false);
    }
  };

  if (user?.role === 'companyAdmin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-200 to-green-50 py-6 px-2 md:px-8">
        {/* Image Modal */}
        {showImageModal && calendarData?.calendarFile && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-md w-full bg-white rounded-lg overflow-hidden shadow-xl">
              <div className="bg-green-400 text-center py-3">
                <h3 className="font-bold text-lg uppercase">HOLIDAYS LIST</h3>
                <p className="text-sm">Year 2025</p>
              </div>
              <div className="p-4 max-h-[70vh] overflow-y-auto">
                <img 
                  src={calendarData.calendarFile} 
                  alt="Holiday Calendar" 
                  className="w-full" 
                />
              </div>
              <button 
                onClick={() => setShowImageModal(false)}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}
        
        {dashboardLoading && (
          <div className="max-w-5xl mx-auto text-center py-8">
            <span className="text-lg text-gray-600">Loading dashboard...</span>
          </div>
        )}
        {dashboardError && (
          <div className="max-w-5xl mx-auto text-center py-8 text-red-500">{dashboardError}</div>
        )}
        {/* Header Card */}
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl bg-[#23292F] flex flex-col md:flex-row items-center justify-between px-8 py-6 mb-8 shadow-lg">
            {/* Left: Greeting + Profile */}
            <div className="w-full md:w-auto mb-4 md:mb-0">
              <div className="text-white text-base font-semibold mb-2">Hello <span role="img" aria-label="waving hand">👋</span></div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 border-4 border-white overflow-hidden">
                  {/* Avatar Placeholder */}
                  <span className="w-full h-full block bg-gray-300" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-300">Vishal Rathore</div>
                  <div className="text-sm text-white opacity-80">HR Manager</div>
                </div>
              </div>
            </div>
            {/* Right: Clock icons + Metrics */}
            <div className="flex flex-col md:items-end w-full md:w-auto">
              <div className="flex gap-2 mb-2">
                <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold">
                  <LogIn className="h-4 w-4" />
                  Clock in
                </span>
                <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-semibold">
                  <LogOut className="h-4 w-4" />
                  Clock Out
                </span>
              </div>
              <div className="bg-white rounded-lg px-4 py-2 flex flex-col md:flex-row gap-4 items-center shadow">
                <div className="text-xs text-gray-500">Date<br /><span className="text-base text-gray-800 font-semibold">19/09/2025</span></div>
                <div className="text-xs text-gray-500">Clockin<br /><span className="text-base text-gray-800 font-semibold">10:00:00</span></div>
                <div className="text-xs text-gray-500">Clockout<br /><span className="text-base text-gray-800 font-semibold">19:00:00</span></div>
                <div className="text-xs text-gray-500">Working hours<br /><span className="text-base text-gray-800 font-semibold">9 hours</span></div>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Events (static for now) */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow p-6 mb-6 flex flex-col items-center">
              <div className="text-gray-500 text-sm mb-4 font-semibold">Today</div>
              <div className="w-full flex flex-col items-center">
                {calendarLoading ? (
                  <div className="w-full flex justify-center items-center h-32"><span className="text-gray-400">Loading...</span></div>
                ) : calendarData?.calendarFile ? (
                  <>
                    <img 
                      src={calendarData.calendarFile} 
                      alt="Holiday Calendar" 
                      className="w-full h-64 object-cover rounded mb-2 border cursor-pointer" 
                      onClick={() => setShowImageModal(true)}
                    />
                  </>
                ) : (
                  <span className="text-gray-400 mb-2">No calendar uploaded</span>
                )}
                <input
                  id="calendar-upload-input"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleCalendarUpload}
                />
                <button
                  type="button"
                  className="flex items-center gap-2 text-green-600 hover:text-green-800 text-xs font-semibold border border-green-200 rounded px-3 py-1 bg-green-50 mt-2"
                  onClick={() => {
                    if (fileInputRef.current) fileInputRef.current.click();
                  }}
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 16v-8M8 12h8" stroke="#3CC78F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="3" width="18" height="18" rx="4" stroke="#3CC78F" strokeWidth="1.5"/></svg>
                  Upload Calendar
                </button>
              </div>
            </div>
          </div>
          {/* Right: Cardss */}  
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Total Employees (full width) */}
            <div className="bg-white rounded-2xl shadow p-4 sm:p-6 sm:col-span-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-gray-700 text-base font-semibold flex items-center gap-2">
                    <span>Total Employees</span>
                    <span className="text-3xl font-bold text-green-700 leading-none">{dashboardStats?.employees?.total ?? '-'}</span>
                  </div>
                  <div className="flex gap-4 text-xs mt-2">
                    <span className="text-green-600 font-bold">Active {dashboardStats?.employees?.active ?? '-'}</span>
                    <span className="text-red-500 font-bold">Inactive {dashboardStats?.employees?.inactive ?? '-'}</span>
                  </div>
                </div>
                <button
                  className="w-full sm:w-auto bg-[#4CDC9C] text-[#2C373B] hover:bg-[#3fd190] rounded-lg px-4 py-2 font-semibold transition"
                  onClick={() => navigate('/employees')}
                >
                  Manage Employees
                </button>
              </div>
            </div>
            {/* Total Leave Requests (full width) */}
            <div className="bg-white rounded-2xl shadow p-4 sm:p-6 sm:col-span-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-gray-700 text-base font-semibold flex items-center gap-2">
                    <span>Total Leave requests</span>
                    <span className="text-3xl font-bold text-green-700 leading-none">{dashboardStats?.leaves?.total ?? '-'}</span>
                  </div>
                  <div className="flex gap-4 text-xs mt-2">
                    <span className="text-green-600 font-bold">Approved {dashboardStats?.leaves?.approved ?? '-'}</span>
                    <span className="text-red-500 font-bold">Declined {dashboardStats?.leaves?.declined ?? '-'}</span>
                    <span className="text-yellow-500 font-bold">Pending {dashboardStats?.leaves?.pending ?? '-'}</span>
                  </div>
                </div>
                <button
                  className="w-full sm:w-auto bg-[#4CDC9C] text-[#2C373B] hover:bg-[#3fd190] rounded-lg px-4 py-2 font-semibold transition"
                  onClick={() => navigate('/leaves/requests')}
                >
                  Manage leaves requests
                </button>
              </div>
            </div>
            {/* Leave Policy - Redesigned to match screenshot */}
            <div className="bg-white rounded-2xl shadow p-4 sm:p-5 flex flex-col justify-between border-2 border-green-200" style={{boxShadow: '0 2px 8px 0 rgba(60, 199, 143, 0.08)'}}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#3CC78F" fillOpacity="0.15"/><path d="M8.5 10.5h7M8.5 13.5h4M12 7.5v9" stroke="#3CC78F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="text-gray-700 font-semibold text-base">Leave Policy</span>
              </div>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-3xl font-bold text-green-500 leading-none">{dashboardStats?.leavePolicy?.active ?? '-'}</span>
                <span className="text-base text-gray-700 font-medium mb-1">active policy</span>
              </div>
              <div className="flex gap-4 text-xs font-medium mb-4">
                <span className="text-gray-400">Casual <span className="text-green-500 font-bold">{dashboardStats?.leavePolicy?.casual ?? '-'}</span></span>
                <span className="text-gray-400">Medical <span className="text-red-400 font-bold">{dashboardStats?.leavePolicy?.medical ?? '-'}</span></span>
                <span className="text-gray-400">Earned <span className="text-yellow-500 font-bold">{dashboardStats?.leavePolicy?.earned ?? '-'}</span></span>
              </div>
              <button 
                className="w-full bg-[#4CDC9C] text-[#2C373B] hover:bg-[#3fd190] rounded-lg py-2 font-semibold transition text-base shadow-none"
                onClick={() => navigate('/leaves/policy')}
              >
                Manage Leave Policy
              </button>
            </div>
            {/* Payroll Processed */}
            <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-gray-700 text-sm font-semibold">Payroll Processed <span className="text-xs text-gray-400">this month</span></div>
                  <div className="text-3xl font-bold text-green-700 mt-1">{dashboardStats?.payroll?.processed ?? '-'}/{dashboardStats?.employees?.total ?? '-'}</div>
                  <div className="flex gap-4 text-xs mt-2">
                    <span className="text-green-600 font-bold">{dashboardStats?.payroll?.processed ?? '-'} / {dashboardStats?.employees?.total ?? '-'} employees</span>
                    <span className="text-red-500 font-bold">Pending employees {dashboardStats?.payroll?.pending ?? '-'}</span>
                  </div>
                </div>
                <button 
                  className="w-full sm:w-auto bg-[#4CDC9C] text-[#2C373B] hover:bg-[#3fd190] rounded-lg px-4 py-2 font-semibold transition"
                  onClick={() => navigate('/payroll')}
                >
                  Manage Payroll
                </button>
              </div>
            </div>
            {/* Reports */}
            <div className="bg-white rounded-2xl shadow p-4 sm:p-6 sm:col-span-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-gray-700 text-base font-semibold">Reports</div>
                <button
                  className="w-full sm:w-auto bg-[#4CDC9C] text-[#2C373B] hover:bg-[#3fd190] rounded-lg px-4 py-2 font-semibold transition"
                  onClick={() => navigate('/reports')}
                >
                  Manage Reports
                </button>
              </div>
              <div className="text-3xl font-bold text-green-700 mt-3">{dashboardStats?.reports?.total ?? '-'}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Super Admin Dashboard UI (default)
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-black">Create and Manage all organizations in one place</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Create Organization Card - always first */}
        <Card
          className="hover:shadow-lg transition-shadow flex flex-col items-center p-0 border-2 border-dashed border-green-600 bg-green-50 cursor-pointer group min-h-[220px]"
          onClick={() => window.location.href = '/create-organization'}
        >
          <div className="flex-1 w-full flex flex-col items-center justify-center p-8">
            <Plus className="h-10 w-10 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg text-green-700 text-center mb-2">Create Organization</h3>
            <p className="text-green-800 text-center text-sm">Start a new organization</p>
          </div>
        </Card>
        {/* Organization Cards */}
        {loading ? (
          <div className="col-span-full flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : error ? (
          <div className="col-span-full text-center text-destructive p-4">{error}</div>
        ) : organizations.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center h-40 text-center">
            <Building className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Organizations Found</h3>
            <p className="text-muted-foreground mt-1">Create your first organization to get started</p>
          </div>
        ) : (
          organizations
            .filter(org => org.name?.toLowerCase().includes(search.toLowerCase()))
            .map((org, index) => (
              <Card key={org._id || index} className="hover:shadow-md transition-shadow flex flex-col items-center p-0">
                {org.logoUrl && (
                  <img src={org.logoUrl} alt={org.name} className="w-full h-32 object-cover rounded-t" />
                )}
                <div className="flex-1 w-full flex flex-col items-center p-4">
                  <h3 className="font-bold text-xl text-center mb-4 w-full">{org.name}</h3>
                  <Button className="w-full mt-auto bg-green-600 hover:bg-green-700 text-white" asChild>
                    <Link to={`/organizations/${org._id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </Card>
            ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;