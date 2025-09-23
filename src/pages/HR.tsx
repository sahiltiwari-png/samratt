import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Building, Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getOrganizations, getOrganizationById, Organization } from "@/api/organizations";

const HR = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (id) {
          // If ID is provided, fetch specific organization
          const orgData = await getOrganizationById(id);
          setSelectedOrg(orgData);
        } else {
          // Otherwise fetch all organizations
          const orgsData = await getOrganizations();
          setOrganizations(orgsData);
        }
        
        setError("");
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // If loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If viewing a specific organization
  if (id && selectedOrg) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Organization Details</h1>
          <div className="flex gap-2">
            <Button onClick={() => navigate(`/create-organization/${selectedOrg.id}`)} variant="default">
              Edit Organization
            </Button>
            <Button onClick={handleBackToDashboard} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Organization Info */}
          <Card className="p-6">
            <div className="flex items-center mb-6">
              {selectedOrg.logoUrl ? (
                <img 
                  src={selectedOrg.logoUrl} 
                  alt={`${selectedOrg.name} logo`} 
                  className="w-16 h-16 rounded-full mr-4 object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <Building className="w-8 h-8 text-gray-500" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">{selectedOrg.name}</h2>
                <p className="text-gray-600">{selectedOrg.industryType}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <Building className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Registration & Tax</p>
                  <p className="text-gray-600">Reg: {selectedOrg.registrationNumber}</p>
                  <p className="text-gray-600">Tax ID: {selectedOrg.taxId}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Users className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Working Hours</p>
                  <p className="text-gray-600">Days: {selectedOrg.workingDays}</p>
                  <p className="text-gray-600">Hours: {selectedOrg.dayStartTime} - {selectedOrg.dayEndTime}</p>
                  <p className="text-gray-600">Timezone: {selectedOrg.timezone}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact & Address */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Users className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Contact Person</p>
                  <p className="text-gray-600">{selectedOrg.contactPersonName}</p>
                  <p className="text-gray-600">{selectedOrg.contactEmail}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Users className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-gray-600">{selectedOrg.contactPhone}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Users className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-gray-600">{selectedOrg.addressLine1}</p>
                  {selectedOrg.addressLine2 && (
                    <p className="text-gray-600">{selectedOrg.addressLine2}</p>
                  )}
                  <p className="text-gray-600">
                    {selectedOrg.city}, {selectedOrg.state} {selectedOrg.zipCode}
                  </p>
                  <p className="text-gray-600">{selectedOrg.country}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Admin Information */}
          <Card className="p-6 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Administrator</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Name</p>
                <p className="text-gray-600">{selectedOrg.admin?.firstName} {selectedOrg.admin?.lastName}</p>
              </div>
              
              <div>
                <p className="font-medium">Email</p>
                <p className="text-gray-600">{selectedOrg.admin?.email}</p>
              </div>
              
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-gray-600">{selectedOrg.admin?.phone}</p>
              </div>
              
              <div>
                <p className="font-medium">Status</p>
                <p className={`${selectedOrg.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {selectedOrg.status?.charAt(0).toUpperCase() + selectedOrg.status?.slice(1)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Organizations list view
  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-primary/10 to-primary/5">
      {/* Header with Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Create and Manage all organizations in one place</h1>
          <Button onClick={handleBackToDashboard} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search organizations by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {error ? (
          <div className="col-span-full text-center p-6 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        ) : organizations.length === 0 ? (
          <div className="col-span-full flex justify-center items-center min-h-[300px]">
            <Card className="w-full max-w-xs border-dashed border-2 border-gray-200 hover:shadow-lg transition cursor-pointer" onClick={() => navigate('/create-organization')}>
              <CardContent className="flex flex-col items-center py-8">
                <div className="bg-gray-100 rounded-full p-4 mb-4">
                  <Plus className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No Organizations Found</h3>
                <p className="text-gray-500 mb-4 text-center">Create your first organization to get started.</p>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10" onClick={e => { e.stopPropagation(); navigate('/create-organization'); }}>
                  Create Organization
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          organizations.map((org) => (
            <Card key={org._id ? org._id : org.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center mb-4">
                  {org.logoUrl ? (
                    <img 
                      src={org.logoUrl} 
                      alt={`${org.name} logo`}
                      className="h-16 w-auto"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <Building className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{org.name}</h3>
                  <p className="text-sm text-gray-500">{org.industryType}</p>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white" asChild>
                  <Link to={`/hr/${org._id ? org._id : org.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
        
        {/* Create New Organization Card */}
        <Card className="border-2 border-dashed border-gray-300 hover:border-primary/50 transition-colors">
          <CardContent className="flex flex-col items-center justify-center h-full py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Create New Organization</h3>
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-white"
              asChild
            >
              <Link to="/create-organization">Create Organization</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HR;