import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  getLeavePolicies,
  createLeavePolicy,
  LeavePolicy,
  LeaveType,
  CreateLeavePolicyPayload,
} from "@/api/leavePolicy";
import { useAuth } from "@/contexts/AuthContext";

const LeavePolicy = () => {
  const [policies, setPolicies] = useState<LeavePolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormMode, setIsFormMode] = useState(false);
  const { organizationId } = useAuth();

  const [policyForm, setPolicyForm] = useState({
    name: "",
    effectiveFrom: "",
    effectiveTo: "",
    isDefault: false,
    isActive: true,
  });

  const [leaveTypeForm, setLeaveTypeForm] = useState({
    type: "",
    interval: "",
    intervalValue: 0,
    carryForward: false,
    maxCarryForward: 0,
    encashable: false,
    maxEncashable: 0,
    probationApplicable: true,
    expireMonthly: false,
    minContinuousWorkDays: 0,
    allowNegativeBalance: false,
    maxNegativeBalance: 0,
    allowUnpaidLeave: false,
  });

  const [currentLeaveTypes, setCurrentLeaveTypes] = useState<
    Omit<LeaveType, "_id">[]
  >([]);

  const leaveTypeOptions = [
    { value: "annual", label: "Annual Leave" },
    { value: "sick", label: "Sick Leave" },
    { value: "maternity", label: "Maternity Leave" },
    { value: "paternity", label: "Paternity Leave" },
    { value: "medical", label: "Medical Leave" },
    { value: "casual", label: "Casual Leave" },
    { value: "emergency", label: "Emergency Leave" },
  ];

  const intervalOptions = [
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Yearly" },
  ];

  useEffect(() => {
    fetchPolicies();
  }, [organizationId]);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await getLeavePolicies();
      if (response.success && response.data.length > 0) {
        setPolicies(response.data);
        setIsFormMode(false);
      } else {
        setPolicies([]);
        setIsFormMode(true);
      }
    } catch (error) {
      setPolicies([]);
      setIsFormMode(true);
      toast({
        title: "Error",
        description: "Failed to fetch leave policies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePolicy = async () => {
    if (!organizationId) {
      toast({
        title: "Error",
        description: "Organization ID not found",
        variant: "destructive",
      });
      return;
    }

    if (!policyForm.name || !policyForm.effectiveFrom || currentLeaveTypes.length === 0) {
      toast({
        title: "Error",
        description: "Please fill all required fields and add at least one leave type",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload: CreateLeavePolicyPayload = {
        organizationId,
        name: policyForm.name,
        effectiveFrom: policyForm.effectiveFrom,
        effectiveTo: policyForm.effectiveTo,
        isDefault: policyForm.isDefault,
        isActive: policyForm.isActive,
        leaveTypes: currentLeaveTypes,
      };

      await createLeavePolicy(payload);
      toast({
        title: "Success",
        description: "Leave policy created successfully!",
      });

      setPolicyForm({
        name: "",
        effectiveFrom: "",
        effectiveTo: "",
        isDefault: false,
        isActive: true,
      });
      setCurrentLeaveTypes([]);
      fetchPolicies();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create leave policy",
        variant: "destructive",
      });
    }
  };

  const handleAddLeaveType = () => {
    if (!leaveTypeForm.type || !leaveTypeForm.interval || leaveTypeForm.intervalValue <= 0) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const newLeaveType: Omit<LeaveType, "_id"> = { ...leaveTypeForm };
    setCurrentLeaveTypes([...currentLeaveTypes, newLeaveType]);

    setLeaveTypeForm({
      type: "",
      interval: "",
      intervalValue: 0,
      carryForward: false,
      maxCarryForward: 0,
      encashable: false,
      maxEncashable: 0,
      probationApplicable: true,
      expireMonthly: false,
      minContinuousWorkDays: 0,
      allowNegativeBalance: false,
      maxNegativeBalance: 0,
      allowUnpaidLeave: false,
    });

    setIsModalOpen(false);
    toast({
      title: "Success",
      description: "Leave type added successfully",
    });
  };

  const removeLeaveType = (index: number) => {
    const updatedTypes = currentLeaveTypes.filter((_, i) => i !== index);
    setCurrentLeaveTypes(updatedTypes);
    toast({
      title: "Removed",
      description: "Leave type removed",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-200 via-emerald-100 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold">Leave Policy Management</h1>
          {!isFormMode && (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="hover:opacity-90"
              style={{ backgroundColor: '#4CDC9C' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Leave Type
            </Button>
          )}
        </div>

        {isFormMode ? (
          <Card className="w-full max-w-3xl mx-auto shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle>Create New Leave Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* form fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Policy Name *</Label>
                  <Input
                    id="name"
                    value={policyForm.name}
                    onChange={(e) =>
                      setPolicyForm({ ...policyForm, name: e.target.value })
                    }
                    placeholder="Enter policy name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="effectiveFrom">Effective From *</Label>
                  <Input
                    id="effectiveFrom"
                    type="date"
                    value={policyForm.effectiveFrom}
                    onChange={(e) =>
                      setPolicyForm({
                        ...policyForm,
                        effectiveFrom: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="effectiveTo">Effective To</Label>
                  <Input
                    id="effectiveTo"
                    type="date"
                    value={policyForm.effectiveTo}
                    onChange={(e) =>
                      setPolicyForm({
                        ...policyForm,
                        effectiveTo: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* checkboxes */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isDefault"
                    checked={policyForm.isDefault}
                    onCheckedChange={(checked) =>
                      setPolicyForm({
                        ...policyForm,
                        isDefault: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="isDefault">Default Policy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={policyForm.isActive}
                    onCheckedChange={(checked) =>
                      setPolicyForm({
                        ...policyForm,
                        isActive: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>

              {/* added leave types */}
              {currentLeaveTypes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Added Leave Types</h3>
                  <div className="space-y-2">
                    {currentLeaveTypes.map((leaveType, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm"
                      >
                        <div>
                          <span className="font-medium capitalize">
                            {leaveType.type}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            {leaveType.intervalValue} / {leaveType.interval}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeLeaveType(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(true)}
                  className="hover:opacity-90"
                  style={{ backgroundColor: '#E8F8F3', color: '#2D7A5A', borderColor: '#4CDC9C' }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Leave Type
                </Button>
                <Button
                  onClick={handleCreatePolicy}
                  className="hover:opacity-90"
                  style={{ backgroundColor: '#4CDC9C' }}
                  disabled={currentLeaveTypes.length === 0}
                >
                  Create Policy
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle>Existing Leave Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>Limit</TableHead>
                      <TableHead>Interval</TableHead>
                      <TableHead>Carry Forward</TableHead>
                      <TableHead>Encashment</TableHead>
                      <TableHead>Probation</TableHead>
                      <TableHead>Min Work Days</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {policies.map((policy) =>
                      policy.leaveTypes.map((leaveType, index) => (
                        <TableRow key={`${policy._id}-${index}`}>
                          <TableCell className="capitalize">
                            {leaveType.type}
                          </TableCell>
                          <TableCell>{leaveType.intervalValue}</TableCell>
                          <TableCell className="capitalize">
                            {leaveType.interval}
                          </TableCell>
                          <TableCell>
                            {leaveType.carryForward ? "Yes" : "No"}
                          </TableCell>
                          <TableCell>
                            {leaveType.encashable ? "Yes" : "No"}
                          </TableCell>
                          <TableCell>
                            {leaveType.probationApplicable ? "Yes" : "No"}
                          </TableCell>
                          <TableCell>
                            {leaveType.minContinuousWorkDays || "N/A"}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
            <DialogHeader>
              <DialogTitle>Add Leave Type</DialogTitle>
            </DialogHeader>
            {/* modal form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
              {/* Leave type dropdown */}
              <div className="space-y-2">
                <Label>Leave Type *</Label>
                <Select
                  value={leaveTypeForm.type}
                  onValueChange={(value) =>
                    setLeaveTypeForm({ ...leaveTypeForm, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Interval dropdown */}
              <div className="space-y-2">
                <Label>Interval *</Label>
                <Select
                  value={leaveTypeForm.interval}
                  onValueChange={(value) =>
                    setLeaveTypeForm({ ...leaveTypeForm, interval: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    {intervalOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Inputs */}
              <div className="space-y-2">
                <Label>Interval Value *</Label>
                <Input
                  type="number"
                  value={leaveTypeForm.intervalValue}
                  onChange={(e) =>
                    setLeaveTypeForm({
                      ...leaveTypeForm,
                      intervalValue: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="e.g. 2"
                />
              </div>

              <div className="space-y-2">
                <Label>Min Continuous Work Days</Label>
                <Input
                  type="number"
                  value={leaveTypeForm.minContinuousWorkDays}
                  onChange={(e) =>
                    setLeaveTypeForm({
                      ...leaveTypeForm,
                      minContinuousWorkDays: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>

              {/* checkboxes */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={leaveTypeForm.carryForward}
                  onCheckedChange={(checked) =>
                    setLeaveTypeForm({
                      ...leaveTypeForm,
                      carryForward: checked as boolean,
                    })
                  }
                />
                <Label>Carry Forward</Label>
              </div>

              {leaveTypeForm.carryForward && (
                <div className="space-y-2">
                  <Label>Max Carry Forward</Label>
                  <Input
                    type="number"
                    value={leaveTypeForm.maxCarryForward}
                    onChange={(e) =>
                      setLeaveTypeForm({
                        ...leaveTypeForm,
                        maxCarryForward: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={leaveTypeForm.encashable}
                  onCheckedChange={(checked) =>
                    setLeaveTypeForm({
                      ...leaveTypeForm,
                      encashable: checked as boolean,
                    })
                  }
                />
                <Label>Encashable</Label>
              </div>

              {leaveTypeForm.encashable && (
                <div className="space-y-2">
                  <Label>Max Encashable</Label>
                  <Input
                    type="number"
                    value={leaveTypeForm.maxEncashable}
                    onChange={(e) =>
                      setLeaveTypeForm({
                        ...leaveTypeForm,
                        maxEncashable: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={leaveTypeForm.allowNegativeBalance}
                  onCheckedChange={(checked) =>
                    setLeaveTypeForm({
                      ...leaveTypeForm,
                      allowNegativeBalance: checked as boolean,
                    })
                  }
                />
                <Label>Allow Negative Balance</Label>
              </div>

              {leaveTypeForm.allowNegativeBalance && (
                <div className="space-y-2">
                  <Label>Max Negative Balance</Label>
                  <Input
                    type="number"
                    value={leaveTypeForm.maxNegativeBalance}
                    onChange={(e) =>
                      setLeaveTypeForm({
                        ...leaveTypeForm,
                        maxNegativeBalance: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={leaveTypeForm.expireMonthly}
                  onCheckedChange={(checked) =>
                    setLeaveTypeForm({
                      ...leaveTypeForm,
                      expireMonthly: checked as boolean,
                    })
                  }
                />
                <Label>Expire Monthly</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={leaveTypeForm.probationApplicable}
                  onCheckedChange={(checked) =>
                    setLeaveTypeForm({
                      ...leaveTypeForm,
                      probationApplicable: checked as boolean,
                    })
                  }
                />
                <Label>Applicable in Probation</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={leaveTypeForm.allowUnpaidLeave}
                  onCheckedChange={(checked) =>
                    setLeaveTypeForm({
                      ...leaveTypeForm,
                      allowUnpaidLeave: checked as boolean,
                    })
                  }
                />
                <Label>Allow Unpaid Leave</Label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                  onClick={handleAddLeaveType}
                  className="hover:opacity-90"
                  style={{ backgroundColor: '#4CDC9C' }}
                >
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LeavePolicy;
