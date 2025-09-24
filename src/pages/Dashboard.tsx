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
  }, []);

  // Company Admin Dashboard UI (matches provided image)
  if (user?.role === 'companyAdmin') {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-green-100 to-white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 flex flex-col items-center shadow-md">
            <div className="text-3xl font-bold text-green-600">89</div>
            <div className="text-sm text-gray-500 mb-2">Active <span className="text-green-500">11</span> Inactive <span className="text-red-500">4</span></div>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-auto">Manage Employees</Button>
          </Card>
          <Card className="p-6 flex flex-col items-center shadow-md">
            <div className="text-3xl font-bold text-green-600">Total Attendance</div>
            <div className="text-sm text-gray-500 mb-2">this month</div>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-auto">Manage Leaves</Button>
          </Card>
          <Card className="p-6 flex flex-col items-center shadow-md">
            <div className="text-3xl font-bold text-green-600">19</div>
            <div className="text-sm text-gray-500 mb-2">Approved <span className="text-green-500">11</span> Declined <span className="text-red-500">4</span> Pending <span className="text-yellow-500">4</span></div>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-auto">Manage leaves requests</Button>
          </Card>
          <Card className="p-6 flex flex-col items-center shadow-md col-span-2">
            <div className="font-semibold mb-2">Today, 13 Sep 2021</div>
            <div className="w-full space-y-2">
              <div className="bg-white rounded-lg p-3 shadow-sm">Interview with candidates<br /><span className="text-xs text-gray-400">Today - 10:30 AM</span></div>
              <div className="bg-white rounded-lg p-3 shadow-sm">Short meeting with product designer from IT Departement<br /><span className="text-xs text-gray-400">Today - 09:15 AM</span></div>
              <div className="bg-white rounded-lg p-3 shadow-sm">Sort Front-end developer candidates<br /><span className="text-xs text-gray-400">Today - 11:30 AM</span></div>
            </div>
          </Card>
          <Card className="p-6 flex flex-col items-center shadow-md">
            <div className="font-semibold mb-2">Leave Policy</div>
            <div className="text-sm text-gray-500 mb-2">3 active policy<br />Casual 11  Medical 4  Earned 4</div>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-auto">Edit Policy</Button>
          </Card>
          <Card className="p-6 flex flex-col items-center shadow-md">
            <div className="font-semibold mb-2">Payroll Processed</div>
            <div className="text-sm text-gray-500 mb-2">69/89 employees<br />Pending employees <span className="text-red-500">20</span></div>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-auto">Edit Policy</Button>
          </Card>
          <Card className="p-6 flex flex-col items-center shadow-md">
            <div className="font-semibold mb-2">Update Salary</div>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-auto">Update Salary</Button>
          </Card>
          <Card className="p-6 flex flex-col items-center shadow-md">
            <div className="font-semibold mb-2">Reports</div>
            <div className="text-sm text-gray-500 mb-2">19<br />Approved 11  Declined 4  Pending 4</div>
          </Card>
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