import API from './auth';

export interface LeaveType {
  _id?: string;
  type: string;
  interval: string;
  intervalValue: number;
  carryForward: boolean;
  maxCarryForward: number;
  encashable: boolean;
  maxEncashable: number;
  probationApplicable: boolean;
  expireMonthly: boolean;
  minContinuousWorkDays: number;
  allowNegativeBalance: boolean;
  maxNegativeBalance: number;
  allowUnpaidLeave: boolean;
}

export interface LeavePolicy {
  _id: string;
  organizationId: string;
  name: string;
  effectiveFrom: string;
  effectiveTo: string;
  leaveTypes: LeaveType[];
  isDefault: boolean;
  isActive: boolean;
  createdBy: string | null;
  modifiedBy: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface LeavePolicyResponse {
  success: boolean;
  data: LeavePolicy[];
}

export interface CreateLeavePolicyPayload {
  organizationId: string;
  leaveTypes: Omit<LeaveType, '_id'>[];
  name: string;
  effectiveFrom: string;
  effectiveTo?: string;
  isDefault: boolean;
  isActive: boolean;
}

export const getLeavePolicies = async (): Promise<LeavePolicyResponse> => {
  const res = await API.get('/leave-policy');
  return res.data;
};

export const createLeavePolicy = async (payload: CreateLeavePolicyPayload) => {
  const res = await API.post('/leave-policy', payload);
  return res.data;
};

export const updateLeavePolicy = async (id: string, payload: Partial<CreateLeavePolicyPayload>) => {
  const res = await API.put(`/leave-policy/${id}`, payload);
  return res.data;
};

export const deleteLeavePolicy = async (id: string) => {
  const res = await API.delete(`/leave-policy/${id}`);
  return res.data;
};