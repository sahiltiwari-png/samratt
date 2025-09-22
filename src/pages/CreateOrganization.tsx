import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Upload } from "lucide-react";

const CreateOrganization = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    organizationName: "",
    taxId: "",
    industry: "",
    registrationNumber: "",
    status: "",
    website: "",
    domain: "",
    addressLine1: "",
    addressLine2: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    logo: null as File | null
  });

  const steps = [
    { id: 1, title: "Organization Details", description: "Basic information about your organization" },
    { id: 2, title: "Address Information", description: "Location and contact details" },
    { id: 3, title: "Contact & Settings", description: "Final setup and configuration" },
    { id: 4, title: "Admin Details", description: "Administrator account setup" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const getProgressPercentage = () => {
    return ((currentStep - 1) / (steps.length - 1)) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New organization</h1>
          
          {/* Progress Bar */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    currentStep >= step.id 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.id}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 ml-6 ${
                      currentStep > step.id ? 'bg-primary' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        </div>

        {/* Form Content */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">
              {steps[currentStep - 1].title}
            </CardTitle>
            <p className="text-gray-600">{steps[currentStep - 1].description}</p>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Step 1: Organization Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Organization Name</Label>
                    <Input
                      id="organizationName"
                      value={formData.organizationName}
                      onChange={(e) => handleInputChange('organizationName', e.target.value)}
                      placeholder="Enter organization name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID</Label>
                    <Input
                      id="taxId"
                      value={formData.taxId}
                      onChange={(e) => handleInputChange('taxId', e.target.value)}
                      placeholder="Enter tax ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      placeholder="Enter industry"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">Registration Number</Label>
                    <Input
                      id="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                      placeholder="Enter registration number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Input
                      id="status"
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      placeholder="Enter status"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="Enter website URL"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Input
                      id="domain"
                      value={formData.domain}
                      onChange={(e) => handleInputChange('domain', e.target.value)}
                      placeholder="Enter domain"
                    />
                  </div>
                </div>

                {/* Logo Upload */}
                <div className="space-y-4">
                  <Label>Organization Logo</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Please upload square image, size less than 100KB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => document.getElementById('logo-upload')?.click()}
                      className="mr-2"
                    >
                      Choose File
                    </Button>
                    <span className="text-sm text-gray-500">
                      {formData.logo ? formData.logo.name : 'No File Chosen'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Address Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="addressLine1">Address Line 1</Label>
                  <Input
                    id="addressLine1"
                    value={formData.addressLine1}
                    onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                    placeholder="Enter address line 1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressLine2">Address Line 2 (optional)</Label>
                  <Input
                    id="addressLine2"
                    value={formData.addressLine2}
                    onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                    placeholder="Enter address line 2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="Enter country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="Enter state"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="Enter zip code"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 & 4 placeholders */}
            {currentStep === 3 && (
              <div className="text-center py-12">
                <p className="text-gray-600">Contact & Settings configuration will be implemented here.</p>
              </div>
            )}

            {currentStep === 4 && (
              <div className="text-center py-12">
                <p className="text-gray-600">Admin Details setup will be implemented here.</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={currentStep === steps.length ? () => console.log('Submit form') : nextStep}
                className="bg-primary hover:bg-primary/90"
              >
                {currentStep === steps.length ? 'Create Organization' : 'Save and continue'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateOrganization;