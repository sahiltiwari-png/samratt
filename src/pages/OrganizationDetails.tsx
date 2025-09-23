import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrganizationById } from "@/api/organizations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const OrganizationDetails = () => {
  const { id } = useParams();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        setLoading(true);
        const data = await getOrganizationById(id);
        setOrganization(data);
      } catch (err) {
        setError("Failed to load organization details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrganization();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!organization) return <div className="p-8 text-center">No organization found.</div>;

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>{organization.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div><strong>Email:</strong> {organization.organizationEmail || organization.contactEmail}</div>
          <div><strong>Contact Person:</strong> {organization.contactPersonName}</div>
          <div><strong>Phone:</strong> {organization.contactPhone}</div>
          <div><strong>Address:</strong> {organization.addressLine1} {organization.addressLine2}, {organization.city}, {organization.state}, {organization.country}, {organization.zipCode}</div>
          {/* Add more fields as needed */}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationDetails;
