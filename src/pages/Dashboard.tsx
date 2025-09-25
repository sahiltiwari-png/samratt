import { useEffect, useState, useContext } from "react";
import { getOrganizations } from "@/api/organizations";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OrgSearchContext } from "@/components/layout/MainLayout";
import { Plus, Building, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { EmployeeList } from "@/components/employees/EmployeeList";
const Dashboard = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { search } = useContext(OrgSearchContext);
  const { user } = useAuth();

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
  if (user?.role === 'companyAdmin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-200 to-green-50 py-6 px-2 md:px-8">
        {/* Header Card */}
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl bg-[#23292F] flex flex-col md:flex-row items-center justify-between px-8 py-6 mb-8 shadow-lg">
            <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
              <div className="w-16 h-16 rounded-full bg-gray-200 border-4 border-white overflow-hidden">
                {/* Avatar Placeholder */}
                <span className="w-full h-full block bg-gray-300" />
              </div>
              <div>
                <div className="text-lg font-semibold text-green-300">Vishal Rathore</div>
                <div className="text-sm text-white opacity-80">HR Manager</div>
              </div>
            </div>
            <div className="flex flex-col md:items-end w-full md:w-auto">
              <div className="flex gap-2 mb-2">
                <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold"><span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>Clock in</span>
                <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-semibold"><span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>Clock Out</span>
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
          {/* Left: Events */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <div className="text-gray-500 text-sm mb-4 font-semibold">Today, 13 Sep 2021</div>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3 text-gray-800">Interview with candidates<br /><span className="text-xs text-gray-400">Today - 10:30 AM</span></div>
                <div className="bg-gray-50 rounded-lg p-3 text-gray-800">Short meeting with product designer from IT Departement<br /><span className="text-xs text-gray-400">Today - 09:15 AM</span></div>
                <div className="bg-gray-50 rounded-lg p-3 text-gray-800">Sort Front-end developer candidates<br /><span className="text-xs text-gray-400">Today - 11:30 AM</span></div>
              </div>
            </div>
          </div>
          {/* Right: Cards */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Total Employees */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="text-gray-500 text-sm font-semibold">Total Employees</div>
                <div className="flex gap-2 text-xs">
                  <span className="text-green-600 font-bold">Active 89</span>
                  <span className="text-red-500 font-bold">Inactive 4</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-green-700 mb-4">89</div>
              <button className="bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 font-semibold transition">Manage Employees</button>
            </div>
            {/* Total Leave Requests */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="text-gray-500 text-sm font-semibold">Total Leave requests</div>
                <div className="flex gap-2 text-xs">
                  <span className="text-green-600 font-bold">Approved 11</span>
                  <span className="text-red-500 font-bold">Declined 4</span>
                  <span className="text-yellow-500 font-bold">Pending 4</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-green-700 mb-4">19</div>
              <button className="bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 font-semibold transition">Manage leaves requests</button>
            </div>
            {/* Leave Policy */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="text-gray-500 text-sm font-semibold">Leave Policy</div>
                <div className="flex gap-2 text-xs">
                  <span className="text-green-600 font-bold">3 active policy</span>
                  <span className="text-gray-500">Casual 11</span>
                  <span className="text-gray-500">Medical 4</span>
                  <span className="text-gray-500">Earned 4</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-green-700 mb-4">3</div>
              <button className="bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 font-semibold transition">Manage Leave Policy</button>
            </div>
            {/* Payroll Processed */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="text-gray-500 text-sm font-semibold">Payroll Processed <span className="text-xs text-gray-400">this month</span></div>
                <div className="flex gap-2 text-xs">
                  <span className="text-green-600 font-bold">69/89 employees</span>
                  <span className="text-red-500 font-bold">Pending employees 20</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-green-700 mb-4">69/89</div>
              <button className="bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 font-semibold transition">Manage Payroll</button>
            </div>
            {/* Reports */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="text-gray-500 text-sm font-semibold">Reports</div>
              </div>
              <div className="text-3xl font-bold text-green-700 mb-4">-</div>
              <button className="bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 font-semibold transition">Manage Reports</button>
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