import API from './auth';

export interface Employee {
  _id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeCode: string;
  designation: string;
  status: string;
  loginEnabled: boolean;
  isActive: boolean;
  isSystemGenerated: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastLoginAt?: string;
  profilePhotoUrl?: string;
  dateOfJoining?: string;
  probationEndDate?: string;
  department?: string;
  employmentType?: string;
  dob?: string;
  gender?: string;
  maritalStatus?: string;
  nationality?: string;
  addressLine1?: string;
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  createdBy?: string;
}

export interface EmployeesResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: Employee[];
}

export const getEmployeeById = async (id: string) => {
  const response = await API.get(`/employees/${id}`);
  return response.data;
};


export const getEmployees = async (params?: {
  page?: number;
  limit?: number;
  status?: string | null;
  designation?: string | null;
  search?: string;
  employeeId?: string;
}) => {
  const query = [];
  if (params) {
    if (params.page) query.push(`page=${params.page}`);
    if (params.limit) query.push(`limit=${params.limit}`);
    if (params.status) query.push(`status=${params.status}`);
    if (params.designation) query.push(`designation=${params.designation}`);
    if (params.search) query.push(`search=${encodeURIComponent(params.search)}`);
    if (params.employeeId) query.push(`employeeId=${params.employeeId}`);
  }
  const queryString = query.length ? `?${query.join('&')}` : '';
  const response = await API.get(`/employees${queryString}`);
  return response.data;
};

export interface EmployeesReportResponse {
  message: string;
  count: number;
  data: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    employeeCode: string;
    designation: string;
    status: string;
    dateOfJoining: string;
    department?: string;
    probationEndDate?: string;
  }[];
}

export const getEmployeesReport = async (params?: {
  status?: string;
}) => {
  const query = [];
  if (params?.status && params.status !== 'all') {
    query.push(`status=${params.status}`);
  }
  const queryString = query.length ? `?${query.join('&')}` : '';
  const response = await API.get(`/reports/active-employees-report${queryString}`);
  return response.data;
};

export const downloadEmployeesReport = async (params?: {
  status?: string;
}) => {
  const query = [];
  if (params?.status && params.status !== 'all') {
    query.push(`status=${params.status}`);
  }
  const queryString = query.length ? `?${query.join('&')}` : '';
  const response = await API.get(`/reports/active-employees-report/download${queryString}`, {
    responseType: 'blob'
  });
  return response;
};
