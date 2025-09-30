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

export const updateLeaveRequestStatus = async (id: string, status: string, remarks?: string) => {
  const res = await API.post(`/leaves/status/update/${id}`, { status, remarks });
  return res.data;
};

export interface LeaveBalance {
  leaveType: string;
  allocated: number;
  used: number;
  balance: number;
}

export interface LeaveBalanceEmployee {
  employee: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    employeeCode: string;
    designation: string;
    profilePhotoUrl?: string;
  };
  leaveBalances: LeaveBalance[];
}

export interface LeaveBalanceResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: LeaveBalanceEmployee[];
}

export const getLeaveBalance = async (
  page: number = 1,
  limit: number = 10,
  leaveType?: string
): Promise<LeaveBalanceResponse> => {
  // Get organization ID from localStorage
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    throw new Error('User not found in localStorage');
  }
  
  const user = JSON.parse(userStr);
  const organizationId = user.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID not found');
  }

  const params = new URLSearchParams();
  params.append('organizationId', organizationId);
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  if (leaveType) {
    params.append('leaveType', leaveType);
  }
  
  const res = await API.get(`/leave-balance?${params.toString()}`);
  return res.data;
};

// Employee interfaces and API functions
export interface EmployeeListItem {
  _id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeCode: string;
  designation: string;
  status: string;
  profilePhotoUrl?: string;
  dateOfJoining: string;
  department?: string;
  employmentType?: string;
  isActive: boolean;
  loginEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeesResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: EmployeeListItem[];
}

export const getEmployees = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<EmployeesResponse> => {
  // Get organization ID from localStorage
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    throw new Error('User not found in localStorage');
  }
  
  const user = JSON.parse(userStr);
  const organizationId = user.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID not found');
  }

  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  if (search) {
    params.append('search', search);
  }
  
  const res = await API.get(`/employees?${params.toString()}`);
  return res.data;
};

// Leave allocation interfaces and API functions
export interface LeaveAllocationRequest {
  organizationId: string;
  employeeId: string;
  leaveType: string;
  days: number;
  remarks?: string;
  leaveTypeId?: string;
  leavePolicyId?: string;
}

export interface LeaveAllocationResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const allocateLeave = async (
  allocationData: Omit<LeaveAllocationRequest, 'organizationId'>
): Promise<LeaveAllocationResponse> => {
  // Get organization ID from localStorage
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    throw new Error('User not found in localStorage');
  }
  
  const user = JSON.parse(userStr);
  const organizationId = user.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID not found');
  }

  const requestData: LeaveAllocationRequest = {
    ...allocationData,
    organizationId
  };
  
  const res = await API.post('/leave-balance/allocate', requestData);
  return res.data;
};

// Employee leave balance history interfaces and API function
export interface LeaveBalanceHistoryItem {
  _id: string;
  organizationId: string;
  employeeId: string;
  leaveTypeId: string;
  leavePolicyId: string;
  leaveType: string;
  allocated: number;
  used: number;
  balance: number;
  history: Array<{
    year: number;
    action: string;
    days: number;
    remarks: string;
    _id: string;
    date: string;
  }>;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface LeaveBalanceHistoryResponse {
  success: boolean;
  data: LeaveBalanceHistoryItem[];
}

export const getEmployeeLeaveBalanceHistory = async (
  employeeId: string,
  leaveType?: string
): Promise<LeaveBalanceHistoryResponse> => {
  // Get organization ID from localStorage
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    throw new Error('User not found in localStorage');
  }
  
  const user = JSON.parse(userStr);
  const organizationId = user.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID not found');
  }

  const params = new URLSearchParams();
  params.append('organizationId', organizationId);
  
  if (leaveType && leaveType !== 'all') {
    params.append('leaveType', leaveType);
  }
  
  const res = await API.get(`/leave-balance/${employeeId}?${params.toString()}`);
  return res.data;
};