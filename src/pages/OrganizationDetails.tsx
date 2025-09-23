
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Upload, CheckCircle, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getOrganizationById, updateOrganization } from "@/api/organizations";
import { uploadFile } from "@/api/uploadFile";
import { toast } from "@/components/ui/use-toast";

const OrganizationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    addressLine1: "",
    addressLine2: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    contactPersonName: "",
    organizationEmail: "",
    contactPhone: "",
    registrationNumber: "",
    taxId: "",
    industryType: "",
    website: "",
    domain: "",
    logoUrl: "",
    timezone: "",
    workingDays: "",
    defaultShiftId: "",
    status: "",
    dayStartTime: "",
    dayEndTime: "",
    admin: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: ""
    }
  });

  useEffect(() => {
    const fetchOrg = async () => {
      if (id) {
        setLoading(true);
        try {
          const org = await getOrganizationById(id);
          setFormData({
            ...org,
            organizationEmail: org.contactEmail || org.organizationEmail || "",
            admin: {
              firstName: org.admin?.firstName || "",
              lastName: org.admin?.lastName || "",
              email: org.admin?.email || "",
              password: "", // Don't prefill password
              phone: org.admin?.phone || ""
            }
          });
        } catch (err) {
          toast({ title: "Error", description: "Failed to load organization.", variant: "destructive" });
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrg();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    setFormError(null);
    // Only validate required fields for update (password not required)
    const requiredFields = [
      { key: 'name', label: 'Organization Name' },
      { key: 'addressLine1', label: 'Address Line 1' },
      { key: 'country', label: 'Country' },
      { key: 'state', label: 'State' },
      { key: 'city', label: 'City' },
      { key: 'zipCode', label: 'Zip Code' },
      { key: 'contactPersonName', label: 'Contact Person Name' },
      { key: 'organizationEmail', label: 'Organization Email' },
      { key: 'contactPhone', label: 'Contact Phone' },
      { key: 'registrationNumber', label: 'Registration Number' },
      { key: 'taxId', label: 'Tax ID' },
      { key: 'industryType', label: 'Industry Type' },
      { key: 'website', label: 'Website' },
      { key: 'domain', label: 'Domain' },
      { key: 'logoUrl', label: 'Logo URL' },
      { key: 'timezone', label: 'Timezone' },
      { key: 'workingDays', label: 'Working Days' },
      { key: 'defaultShiftId', label: 'Default Shift ID' },
      { key: 'status', label: 'Status' },
      { key: 'dayStartTime', label: 'Day Start Time' },
      { key: 'dayEndTime', label: 'Day End Time' },
      // Admin fields (except password)
      { key: 'admin.firstName', label: 'Admin First Name' },
      { key: 'admin.lastName', label: 'Admin Last Name' },
      { key: 'admin.email', label: 'Admin Email' },
      { key: 'admin.phone', label: 'Admin Phone' },
    ];
    for (const field of requiredFields) {
      let value;
      if (field.key.startsWith('admin.')) {
        const adminKey = field.key.split('.')[1];
        value = formData.admin[adminKey];
      } else {
        value = formData[field.key];
      }
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        setFormError(`${field.label} is required.`);
        return;
      }
    }
    if (!validateEmail(formData.organizationEmail)) {
      setFormError('A valid organization email is required.');
      return;
    }
    if (!validateEmail(formData.admin.email)) {
      setFormError('A valid admin email is required.');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        ...formData,
        contactEmail: formData.organizationEmail
      };
      await updateOrganization(id, payload);
      toast({ title: "Success", description: "Organization updated successfully" });
      navigate('/dashboard');
    } catch (error) {
      console.error("Error updating organization:", error);
      toast({
        title: "Error",
        description: "Failed to update organization. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  // ...existing renderStepIndicator and renderStep logic from CreateOrganization.tsx...

  // For brevity, you can copy the renderStepIndicator and renderStep functions from CreateOrganization.tsx here.
  // The only difference: on the last step, the button should say "Update" and call handleSubmit.

  // ...existing code for renderStepIndicator and renderStep...

  // For brevity, you can copy the full multi-stepper form UI from CreateOrganization.tsx, replacing handleSubmit and state as needed.

  // Example return (replace ... with actual code):
  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate('/dashboard')}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Organization</CardTitle>
          <Progress value={(currentStep / 5) * 100} className="h-2" />
        </CardHeader>
        <CardContent>
          {/* Copy renderStepIndicator and renderStep from CreateOrganization.tsx here */}
          {/* Show errors if any */}
          {formError && (
            <div className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded p-2 text-center">
              {formError}
            </div>
          )}
          {/* Copy renderStep from CreateOrganization.tsx, but on last step, button says Update */}
          {/* ... */}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationDetails;
