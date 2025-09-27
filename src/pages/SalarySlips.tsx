import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getSalaryStructures,
  getSalaryStructureByEmployee,
  updateSalaryStructure,
  deleteSalaryStructure,
  type SalaryStructure,
  type SalaryStructuresResponse,
} from "@/api/salaryStructures";

interface SalaryResponseShape {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: SalaryStructure[];
}

const SalarySlip = () => {
  const [salaryData, setSalaryData] = useState<SalaryResponseShape | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState<SalaryStructure | null>(null);
  const [viewDetail, setViewDetail] = useState<SalaryStructure | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    const fetchSalaryData = async () => {
      setLoading(true);
      try {
        const params: any = { page: currentPage, limit: 10 };
        const res: SalaryStructuresResponse = await getSalaryStructures(params);
        const shape: SalaryResponseShape = {
          page: res.page,
          limit: res.limit,
          total: res.total,
          totalPages: res.totalPages,
          items: res.data,
        };
        setSalaryData(shape);
        setError(null);
      } catch (err) {
        setError("Failed to load salary structures");
        setSalaryData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryData();
  }, [currentPage]);

  const openView = async (record: SalaryStructure) => {
    try {
      setSelectedRecord(record);
      const detail = await getSalaryStructureByEmployee(record.employeeId._id);
      setViewDetail(detail.data);
      setViewOpen(true);
    } catch (e) {
      setError("Failed to load salary structure details");
    }
  };

  const openEdit = async (record: SalaryStructure) => {
    try {
      setSelectedRecord(record);
      const detail = await getSalaryStructureByEmployee(record.employeeId._id);
      setEditForm({ ...detail.data });
      setEditOpen(true);
    } catch (e) {
      setError("Failed to load salary structure for edit");
    }
  };

  const openDelete = (record: SalaryStructure) => {
    setSelectedRecord(record);
    setDeleteOpen(true);
  };

  const handleEditChange = (field: string, value: string | number) => {
    setEditForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    if (!selectedRecord?._id) return;
    try {
      const numericFields = [
        "basic",
        "hra",
        "gross",
        "ctc",
        "conveyance",
        "specialAllowance",
        "pf",
        "esi",
        "tds",
        "professionalTax",
        "otherDeductions",
      ] as const;

      const payload: any = {};
      for (const key of numericFields) {
        const val = editForm[key];
        if (val === "" || val === null || val === undefined) continue; // skip empty so backend preserves existing
        const num = typeof val === "number" ? val : Number(val);
        if (!Number.isNaN(num)) payload[key] = num;
      }

      await updateSalaryStructure(selectedRecord._id, payload);
      setEditOpen(false);
      // refresh list
      const res: SalaryStructuresResponse = await getSalaryStructures({ page: currentPage, limit: 10 });
      setSalaryData({ page: res.page, limit: res.limit, total: res.total, totalPages: res.totalPages, items: res.data });
    } catch (e) {
      setError("Failed to update salary structure");
    }
  };

  const handleDelete = async () => {
    if (!selectedRecord?._id) return;
    try {
      await deleteSalaryStructure(selectedRecord._id);
      setDeleteOpen(false);
      // refresh list after delete
      const res: SalaryStructuresResponse = await getSalaryStructures({ page: currentPage, limit: 10 });
      setSalaryData({ page: res.page, limit: res.limit, total: res.total, totalPages: res.totalPages, items: res.data });
    } catch (e) {
      setError("Failed to delete salary structure");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-200 via-emerald-100 to-emerald-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Salary Structure</h1>
        <p className="text-sm text-gray-700 mb-6">
          Overview of employee salary structures with detailed breakdown
        </p>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <p>Loading salary slip data...</p>
            </div>
          ) : (
            <div className="overflow-x-hidden w-full">
              <table className="min-w-full w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Employee</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Code</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">CTC</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">HRA</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Conveyance</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Special Allowance</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Gross</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryData && salaryData.items.length > 0 ? (
                    salaryData.items.map((record) => (
                      <tr
                        key={record._id}
                        className="border-b last:border-0 hover:bg-emerald-50 transition-colors"
                      >
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              {record.employeeId?.profilePhotoUrl ? (
                                <AvatarImage
                                  src={record.employeeId.profilePhotoUrl}
                                  alt={`${record.employeeId.firstName} ${record.employeeId.lastName}`}
                                />
                              ) : null}
                              <AvatarFallback>
                                <User className="h-5 w-5 text-gray-500" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{record.employeeId.firstName} {record.employeeId.lastName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2">{record.employeeId.employeeCode}</td>
                        <td className="px-4 py-2">₹{record.ctc.toLocaleString()}</td>
                        <td className="px-4 py-2">₹{record.hra.toLocaleString()}</td>
                        <td className="px-4 py-2">₹{record.conveyance.toLocaleString()}</td>
                        <td className="px-4 py-2">₹{record.specialAllowance.toLocaleString()}</td>
                        <td className="px-4 py-2 font-semibold">₹{record.gross.toLocaleString()}</td>
                        <td className="px-4 py-2 flex gap-2">
                          <Button
                            variant="link"
                            size="icon"
                            className="text-blue-600 h-8 w-8 p-0 hover:bg-emerald-100 focus:outline-none focus:ring-0 focus:border-0"
                            onClick={() => openView(record)}
                          >
                            <Eye className="w-5 h-5" />
                          </Button>
                          <Button
                            variant="link"
                            size="icon"
                            className="text-emerald-600 h-8 w-8 p-0 hover:bg-emerald-100 focus:outline-none focus:ring-0 focus:border-0"
                            onClick={() => openEdit(record)}
                          >
                            <Edit className="w-5 h-5" />
                          </Button>
                          <Button
                            variant="link"
                            size="icon"
                            className="text-red-600 h-8 w-8 p-0 hover:bg-red-100 focus:outline-none focus:ring-0 focus:border-0"
                            onClick={() => openDelete(record)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-6 text-center text-gray-600">No data found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-lg focus:outline-none focus:ring-0 focus:border-0">
          <DialogHeader>
            <DialogTitle className="text-emerald-700">Salary Structure Details</DialogTitle>
          </DialogHeader>
          {viewDetail && (
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Name:</strong> {viewDetail.employeeId.firstName} {viewDetail.employeeId.lastName}</p>
              <p><strong>Code:</strong> {viewDetail.employeeId.employeeCode}</p>
              <p><strong>Basic:</strong> ₹{viewDetail.basic}</p>
              <p><strong>CTC:</strong> ₹{viewDetail.ctc}</p>
              <p><strong>Gross:</strong> ₹{viewDetail.gross}</p>
              <p><strong>HRA:</strong> ₹{viewDetail.hra}</p>
              <p><strong>Conveyance:</strong> ₹{viewDetail.conveyance}</p>
              <p><strong>Special Allowance:</strong> ₹{viewDetail.specialAllowance}</p>
              <p><strong>PF:</strong> ₹{viewDetail.pf}</p>
              <p><strong>ESI:</strong> ₹{viewDetail.esi}</p>
              <p><strong>TDS:</strong> ₹{viewDetail.tds}</p>
              <p><strong>Professional Tax:</strong> ₹{viewDetail.professionalTax}</p>
              <p><strong>Other Deductions:</strong> ₹{viewDetail.otherDeductions}</p>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="hover:bg-gray-100 focus:outline-none focus:ring-0 focus:border-0">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto focus:outline-none focus:ring-0 focus:border-0">
          <DialogHeader>
            <DialogTitle className="text-emerald-700">Edit Salary Structure</DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="grid gap-3">
              {[
                "ctc",
                "basic",
                "hra",
                "gross",
                "conveyance",
                "specialAllowance",
                "pf",
                "esi",
                "tds",
                "professionalTax",
                "otherDeductions",
              ].map((field) => (
                <div key={field} className="grid gap-1">
                  <Label className="capitalize">{field}</Label>
                  <Input
                    type="number"
                    value={editForm[field] ?? ""}
                    onChange={(e) => handleEditChange(field, e.target.value)}
                    className="focus:outline-none focus:ring-0 focus:border-gray-300"
                  />
                </div>
              ))}
            </div>
          )}
          <DialogFooter className="pt-4 flex gap-2 justify-end">
            <DialogClose asChild>
              <Button variant="outline" className="hover:bg-gray-100 focus:outline-none focus:ring-0 focus:border-0">
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-0 focus:border-0"
              onClick={handleUpdate}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md focus:outline-none focus:ring-0 focus:border-0">
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-700">
            Are you sure you want to delete the salary structure for{" "}
            <strong>{selectedRecord?.employeeId?.firstName} {selectedRecord?.employeeId?.lastName}</strong>?
          </p>
          <DialogFooter className="flex gap-2 justify-end">
            <DialogClose asChild>
              <Button variant="outline" className="hover:bg-gray-100 focus:outline-none focus:ring-0 focus:border-0">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-0 focus:border-0"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalarySlip;
