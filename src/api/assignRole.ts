import API from "./auth";

export interface AssignRolePayload {
  userId: string;
  roleId: string;
  isDefault?: boolean;
}

export const assignRole = async (payload: AssignRolePayload) => {
  try {
    const response = await API.post('/auth/assign-role', payload);
    return response.data;
  } catch (error) {
    console.error('Error assigning role:', error);
    throw error;
  }
};

export const assignRoleToUser = async (userId: string, roleId: string, isDefault: boolean = true) => {
  return assignRole({
    userId,
    roleId,
    isDefault
  });
};