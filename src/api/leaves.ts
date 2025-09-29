import API from './auth';

export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  employeeCode: string;
  profilePhotoUrl?: string;
}

export interface LeaveRequest {
  _id: string;
  employeeId: Employee;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  days: number;
  status: string;
}

export interface LeaveRequestsResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: LeaveRequest[];
}

export const getLeaveRequests = async (page: number = 1, limit: number = 10): Promise<LeaveRequestsResponse> => {
  const res = await API.get(`/leaves?page=${page}&limit=${limit}`);
  return res.data;
};

export const getLeaveRequestById = async (id: string): Promise<{ success: boolean; data: LeaveRequest }> => {
  const res = await API.get(`/leaves/${id}`);
  return res.data;
};

export const updateLeaveRequestStatus = async (id: string, status: string, remark?: string) => {
  const res = await API.put(`/leaves/${id}/status`, { status, remark });
  return res.data;
};