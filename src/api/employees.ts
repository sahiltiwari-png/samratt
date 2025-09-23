import API from './auth';

export const getEmployeeById = async (id: string) => {
  const response = await API.get(`/employees/${id}`);
  return response.data;
};
