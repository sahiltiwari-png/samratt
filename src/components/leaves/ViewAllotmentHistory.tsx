import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getEmployeeLeaveBalanceHistory, LeaveBalanceHistoryItem } from '@/api/leaves';

interface ViewAllotmentHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  employeeName: string;
  employeeDesignation: string;
  profilePhotoUrl?: string;
}

const LEAVE_TYPES = [
  { value: 'all', label: 'All Leave Types' },
  { value: 'casual', label: 'Casual Leave' },
  { value: 'earned', label: 'Earned Leave' },
  { value: 'medical', label: 'Medical Leave' },
  { value: 'paternity', label: 'Paternity Leave' },
  { value: 'maternity', label: 'Maternity Leave' },
];

const ViewAllotmentHistory: React.FC<ViewAllotmentHistoryProps> = ({
  isOpen,
  onClose,
  employeeId,
  employeeName,
  employeeDesignation,
  profilePhotoUrl,
}) => {
  const [selectedLeaveType, setSelectedLeaveType] = useState('all');
  const [historyData, setHistoryData] = useState<LeaveBalanceHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistoryData = async (leaveType: string = 'all') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getEmployeeLeaveBalanceHistory(
        employeeId,
        leaveType === 'all' ? undefined : leaveType
      );
      
      if (response.success) {
        setHistoryData(response.data);
      } else {
        setError('Failed to fetch leave balance history');
        setHistoryData([]);
      }
    } catch (err) {
      console.error('Error fetching leave balance history:', err);
      setError('Failed to load leave balance history');
      setHistoryData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistoryData(selectedLeaveType);
    }
  }, [isOpen, selectedLeaveType, employeeId]);

  const handleLeaveTypeChange = (value: string) => {
    setSelectedLeaveType(value);
  };

  const clearFilters = () => {
    setSelectedLeaveType('all');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt={employeeName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-medium text-gray-600">
                  {employeeName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{employeeName}</h2>
              <p className="text-sm text-gray-500">{employeeDesignation}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Filter Section */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Select value={selectedLeaveType} onValueChange={handleLeaveTypeChange}>
                <SelectTrigger className="w-full sm:w-[200px] bg-white">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  {LEAVE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="text-sm"
            >
              Clear filters
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => fetchHistoryData(selectedLeaveType)}>
                Try Again
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Leave types</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Total Aloted</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Total Taken</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Total balance</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <div className="text-lg">📋</div>
                          <div className="font-medium">No result found</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    historyData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900 capitalize">
                          {item.leaveType} leave
                        </td>
                        <td className="py-3 px-4 text-gray-900 text-center">
                          {item.totalAloted}
                        </td>
                        <td className="py-3 px-4 text-gray-900 text-center">
                          {item.totalTaken}
                        </td>
                        <td className="py-3 px-4 text-gray-900 text-center">
                          {item.totalBalance}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="link"
                            className="text-blue-600 hover:text-blue-800 p-0 h-auto font-normal"
                          >
                            View History
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAllotmentHistory;