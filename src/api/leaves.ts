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
  remarks?: string;
}

export interface LeaveRequestsResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: LeaveRequest[];
}

export const getLeaveRequests = async (
  page: number = 1, 
  limit: number = 10, 
  status?: string, 
  userIds?: string[]
): Promise<LeaveRequestsResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  if (status) {
    params.append('status', status);
  }
  
  if (userIds && userIds.length > 0) {
    userIds.forEach(userId => {
      params.append('userId', userId);
    });
  }
  
  const res = await API.get(`/leaves?${params.toString()}`);
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