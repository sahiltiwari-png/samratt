import API from './auth';

export interface PayrollEmployeeRef {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  employeeCode?: string;
  designation?: string;
  profilePhotoUrl?: string;
}

export interface PayrollItem {
  _id: string;
  employeeId: PayrollEmployeeRef;
  organizationId: string;
  month: number;
  year: number;
  salaryStructureId: string;
  grossEarnings: number;
  basic: number;
  hra: number;
  conveyance?: number;
  specialAllowance?: number;
  pf?: number;
  esi?: number;
  tds?: number;
  professionalTax?: number;
  otherDeductions?: number;
  lossOfPayDays?: number;
  leaveDeductions?: number;
  netPayable: number;
  status: string; // e.g., 'pending', 'processed', 'failed'
  totalWorkedDays?: number;
  generatedAt?: string;
  __v?: number;
}

export interface PayrollResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: PayrollItem[];
}

export const getPayroll = async (params?: { page?: number; limit?: number; month?: number; year?: number }) => {
  const query: string[] = [];
  if (params) {
    if (params.page) query.push(`page=${params.page}`);
    if (params.limit) query.push(`limit=${params.limit}`);
    if (params.month) query.push(`month=${params.month}`);
    if (params.year) query.push(`year=${params.year}`);
  }
  const qs = query.length ? `?${query.join('&')}` : '';
  const res = await API.get(`/payroll${qs}`);
  return res.data as PayrollResponse;
};

export const createPayroll = async (payload: { employeeId: string; month: number; year: number }) => {
  const res = await API.post('/payroll', payload);
  return res.data;
};

export interface PayrollDetailResponse {
  message: string;
  success: boolean;
  data: PayrollItem;
}

export const getPayrollByEmployee = async (employeeId: string) => {
  const res = await API.get(`/payroll/${employeeId}`);
  return res.data as PayrollDetailResponse;
};

export interface UpdatePayrollPayload {
  month?: number;
  year?: number;
  grossEarnings?: number;
  basic?: number;
  hra?: number;
  conveyance?: number;
  specialAllowance?: number;
  pf?: number;
  esi?: number;
  tds?: number;
  professionalTax?: number;
  otherDeductions?: number;
  lossOfPayDays?: number;
  leaveDeductions?: number;
  netPayable?: number;
  status?: string;
  totalWorkedDays?: number;
}

export interface UpdatePayrollResponse {
  success: boolean;
  message: string;
  payroll: PayrollItem;
}

export const updatePayrollById = async (payrollId: string, payload: UpdatePayrollPayload) => {
  const res = await API.put(`/payroll/updateById/${payrollId}`, payload);
  return res.data as UpdatePayrollResponse;
};

export const sendPayslip = async (employeeId: string, month: number, year: number) => {
  const res = await API.post(`/payroll/send-payslip/${employeeId}/${month}/${year}`);
  return res.data;
};
