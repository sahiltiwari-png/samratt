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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-md">
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt={employeeName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-white">
                  {employeeName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{employeeName}</h2>
              <p className="text-sm text-gray-600">{employeeDesignation}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-80 rounded-full transition-all duration-200 group"
          >
            <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
          </button>
        </div>

        {/* Filter Section */}
        <div className="px-5 py-4 border-b border-gray-100 bg-white">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <label className="text-sm font-medium text-gray-700">Filter by:</label>
              <Select value={selectedLeaveType} onValueChange={handleLeaveTypeChange}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white border-gray-200 focus:border-blue-400 focus:ring-blue-400">
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
              className="text-sm border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            >
              Clear filters
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[55vh]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-sm text-gray-600">Loading leave history...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="text-4xl">⚠️</div>
                <p className="text-red-600 font-medium">{error}</p>
                <Button 
                  onClick={() => fetchHistoryData(selectedLeaveType)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-100 bg-gray-50">
                    <th className="text-left py-3 px-3 font-semibold text-gray-800 text-sm">Leave types</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-800 text-sm">Total Alloted</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-800 text-sm">Total Taken</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-800 text-sm">Total Balance</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-800 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {historyData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-3">
                          <div className="text-3xl">📋</div>
                          <div className="font-medium text-gray-600">No result found</div>
                          <div className="text-sm text-gray-500">Try adjusting your filters</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    historyData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-50 hover:bg-blue-50 transition-colors duration-150">
                        <td className="py-3 px-3 text-gray-900 capitalize font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            {item.leaveType} leave
                          </div>
                        </td>
                        <td className="py-3 px-3 text-gray-900 text-center font-medium">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                            {item.totalAloted}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-900 text-center font-medium">
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm">
                            {item.totalTaken}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-900 text-center font-medium">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                            {item.totalBalance}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <Button
                            variant="link"
                            className="text-blue-600 hover:text-blue-800 p-0 h-auto font-medium text-sm hover:underline"
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