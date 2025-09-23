import { useEffect, useState, useContext } from "react";
import { getOrganizations } from "@/api/organizations";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OrgSearchContext } from "@/components/layout/MainLayout";
import { Plus, Building } from "lucide-react";
import { Link } from "react-router-dom";
const Dashboard = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { search } = useContext(OrgSearchContext);

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