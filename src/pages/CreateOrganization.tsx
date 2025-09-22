import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Upload, CheckCircle, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createOrganization } from "@/api/organizations";
import { toast } from "@/components/ui/use-toast";

const CreateOrganization = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
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
    contactEmail: "",
    contactPhone: "",
    registrationNumber: "",
    taxId: "",
    industryType: "",
    website: "",
    domain: "",
    logoUrl: "",
    timezone: "UTC",
    workingDays: "Monday-Friday",
    defaultShiftId: "",
    status: "active",
    dayStartTime: "09:00",
    dayEndTime: "18:00",
    admin: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: ""
    }
  });

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
    // Required fields
    const requiredFields = [
      { key: 'name', label: 'Organization Name' },
      { key: 'addressLine1', label: 'Address Line 1' },
      { key: 'country', label: 'Country' },
      { key: 'state', label: 'State' },
      { key: 'city', label: 'City' },
      { key: 'zipCode', label: 'Zip Code' },
      { key: 'contactPersonName', label: 'Contact Person Name' },
      { key: 'contactEmail', label: 'Organization Email' },
      { key: 'contactPhone', label: 'Contact Phone' },
      { key: 'registrationNumber', label: 'Registration Number' },
      { key: 'taxId', label: 'Tax ID' },
      { key: 'industryType', label: 'Industry Type' },
      { key: 'website', label: 'Website' },
      { key: 'domain', label: 'Domain' },
      { key: 'logoUrl', label: 'Logo URL' },
      { key: 'timezone', label: 'Timezone' },
      { key: 'workingDays', label: 'Working Days' },
      { key: 'status', label: 'Status' },
      { key: 'dayStartTime', label: 'Day Start Time' },
      { key: 'dayEndTime', label: 'Day End Time' },
    ];
    for (const field of requiredFields) {
      if (!formData[field.key] || (typeof formData[field.key] === 'string' && formData[field.key].trim() === '')) {
        setFormError(`${field.label} is required.`);
        return;
      }
    }
    // Validate organization email
    if (!validateEmail(formData.contactEmail)) {
      setFormError('A valid organization email is required.');
      return;
    }
    // Validate admin fields
    const adminFields = [
      { key: 'firstName', label: 'Admin First Name' },
      { key: 'lastName', label: 'Admin Last Name' },
      { key: 'email', label: 'Admin Email' },
      { key: 'password', label: 'Admin Password' },
      { key: 'phone', label: 'Admin Phone' },
    ];
    for (const field of adminFields) {
      if (!formData.admin[field.key] || (typeof formData.admin[field.key] === 'string' && formData.admin[field.key].trim() === '')) {
        setFormError(`${field.label} is required.`);
        return;
      }
    }
    if (!validateEmail(formData.admin.email)) {
      setFormError('A valid admin email is required.');
      return;
    }
    try {
      setLoading(true);
      await createOrganization(formData);
      toast({
        title: "Success",
        description: "Organization created successfully",
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Error creating organization:", error);
      toast({
        title: "Error",
        description: "Failed to create organization. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderStepIndicator = () => {
    const steps = [
      "Organization",
      "Address",
      "Contact",
      "Admin",
      "Review"
    ];

    return (
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep > index + 1 
                  ? "bg-green-500 text-white" 
                  : currentStep === index + 1 
                  ? "bg-primary text-white" 
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {currentStep > index + 1 ? <CheckCircle className="h-5 w-5" /> : index + 1}
            </div>
            <span className="text-xs mt-1">{step}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Organization Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name *</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Acme Corporation" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industryType">Industry Type *</Label>
                <Select 
                  value={formData.industryType} 
                  onValueChange={(value) => handleSelectChange("industryType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number *</Label>
                <Input 
                  id="registrationNumber" 
                  name="registrationNumber" 
                  value={formData.registrationNumber} 
                  onChange={handleChange} 
                  placeholder="REG123456" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID *</Label>
                <Input 
                  id="taxId" 
                  name="taxId" 
                  value={formData.taxId} 
                  onChange={handleChange} 
                  placeholder="TAX123456" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website" 
                  name="website" 
                  value={formData.website} 
                  onChange={handleChange} 
                  placeholder="https://example.com" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input 
                  id="domain" 
                  name="domain" 
                  value={formData.domain} 
                  onChange={handleChange} 
                  placeholder="example.com" 
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Address Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="addressLine1">Address Line 1 *</Label>
                <Input 
                  id="addressLine1" 
                  name="addressLine1" 
                  value={formData.addressLine1} 
                  onChange={handleChange} 
                  placeholder="123 Main St" 
                  required 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input 
                  id="addressLine2" 
                  name="addressLine2" 
                  value={formData.addressLine2} 
                  onChange={handleChange} 
                  placeholder="Suite 100" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input 
                  id="city" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleChange} 
                  placeholder="San Francisco" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province *</Label>
                <Input 
                  id="state" 
                  name="state" 
                  value={formData.state} 
                  onChange={handleChange} 
                  placeholder="California" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip/Postal Code *</Label>
                <Input 
                  id="zipCode" 
                  name="zipCode" 
                  value={formData.zipCode} 
                  onChange={handleChange} 
                  placeholder="94105" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input 
                  id="country" 
                  name="country" 
                  value={formData.country} 
                  onChange={handleChange} 
                  placeholder="United States" 
                  required 
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPersonName">Contact Person Name *</Label>
                <Input 
                  id="contactPersonName" 
                  name="contactPersonName" 
                  value={formData.contactPersonName} 
                  onChange={handleChange} 
                  placeholder="John Doe" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input 
                  id="contactEmail" 
                  name="contactEmail" 
                  type="email"
                  value={formData.contactEmail} 
                  onChange={handleChange} 
                  placeholder="john@example.com" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone *</Label>
                <Input 
                  id="contactPhone" 
                  name="contactPhone" 
                  value={formData.contactPhone} 
                  onChange={handleChange} 
                  placeholder="1234567890" 
                  required 
                />
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Working Hours</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="workingDays">Working Days *</Label>
                  <Select 
                    value={formData.workingDays} 
                    onValueChange={(value) => handleSelectChange("workingDays", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select working days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monday-Friday">Monday-Friday</SelectItem>
                      <SelectItem value="Monday-Saturday">Monday-Saturday</SelectItem>
                      <SelectItem value="Sunday-Thursday">Sunday-Thursday</SelectItem>
                      <SelectItem value="All Days">All Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone *</Label>
                  <Select 
                    value={formData.timezone} 
                    onValueChange={(value) => handleSelectChange("timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Asia/Kolkata">India Standard Time (IST)</SelectItem>
                      <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dayStartTime">Day Start Time *</Label>
                  <Input 
                    id="dayStartTime" 
                    name="dayStartTime" 
                    type="time"
                    value={formData.dayStartTime} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dayEndTime">Day End Time *</Label>
                  <Input 
                    id="dayEndTime" 
                    name="dayEndTime" 
                    type="time"
                    value={formData.dayEndTime} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Admin Account</h2>
            <p className="text-muted-foreground">Create an admin account for this organization</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admin.firstName">First Name *</Label>
                <Input 
                  id="admin.firstName" 
                  name="admin.firstName" 
                  value={formData.admin.firstName} 
                  onChange={handleChange} 
                  placeholder="Admin" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin.lastName">Last Name *</Label>
                <Input 
                  id="admin.lastName" 
                  name="admin.lastName" 
                  value={formData.admin.lastName} 
                  onChange={handleChange} 
                  placeholder="User" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin.email">Email *</Label>
                <Input 
                  id="admin.email" 
                  name="admin.email" 
                  type="email"
                  value={formData.admin.email} 
                  onChange={handleChange} 
                  placeholder="admin@example.com" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin.phone">Phone *</Label>
                <Input 
                  id="admin.phone" 
                  name="admin.phone" 
                  value={formData.admin.phone} 
                  onChange={handleChange} 
                  placeholder="9876543210" 
                  required 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="admin.password">Password *</Label>
                <Input 
                  id="admin.password" 
                  name="admin.password" 
                  type="password"
                  value={formData.admin.password} 
                  onChange={handleChange} 
                  placeholder="••••••••" 
                  required 
                />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Review Information</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Organization Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Name:</div>
                  <div>{formData.name}</div>
                  <div className="text-muted-foreground">Industry:</div>
                  <div>{formData.industryType}</div>
                  <div className="text-muted-foreground">Registration Number:</div>
                  <div>{formData.registrationNumber}</div>
                  <div className="text-muted-foreground">Tax ID:</div>
                  <div>{formData.taxId}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Address</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Address:</div>
                  <div>{formData.addressLine1} {formData.addressLine2}</div>
                  <div className="text-muted-foreground">City:</div>
                  <div>{formData.city}</div>
                  <div className="text-muted-foreground">State:</div>
                  <div>{formData.state}</div>
                  <div className="text-muted-foreground">Country:</div>
                  <div>{formData.country}</div>
                  <div className="text-muted-foreground">Zip Code:</div>
                  <div>{formData.zipCode}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Contact Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Contact Person:</div>
                  <div>{formData.contactPersonName}</div>
                  <div className="text-muted-foreground">Email:</div>
                  <div>{formData.contactEmail}</div>
                  <div className="text-muted-foreground">Phone:</div>
                  <div>{formData.contactPhone}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Working Hours</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Working Days:</div>
                  <div>{formData.workingDays}</div>
                  <div className="text-muted-foreground">Hours:</div>
                  <div>{formData.dayStartTime} - {formData.dayEndTime}</div>
                  <div className="text-muted-foreground">Timezone:</div>
                  <div>{formData.timezone}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Admin Account</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Name:</div>
                  <div>{formData.admin.firstName} {formData.admin.lastName}</div>
                  <div className="text-muted-foreground">Email:</div>
                  <div>{formData.admin.email}</div>
                  <div className="text-muted-foreground">Phone:</div>
                  <div>{formData.admin.phone}</div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

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
          <CardTitle>Create Organization</CardTitle>
          <Progress 
            value={(currentStep / 5) * 100} 
            className="h-2" 
          />
        </CardHeader>
        <CardContent>
          {renderStepIndicator()}
          {formError && (
            <div className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded p-2 text-center">
              {formError}
            </div>
          )}
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || loading}
            >
              Previous
            </Button>
            
            {currentStep < 5 ? (
              <Button onClick={nextStep} disabled={loading}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Creating..." : "Create Organization"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateOrganization;