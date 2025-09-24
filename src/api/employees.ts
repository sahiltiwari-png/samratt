import API from './auth';

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
}) => {
  const query = [];
  if (params) {
    if (params.page) query.push(`page=${params.page}`);
    if (params.limit) query.push(`limit=${params.limit}`);
    if (params.status) query.push(`status=${params.status}`);
    if (params.designation) query.push(`designation=${params.designation}`);
    if (params.search) query.push(`search=${encodeURIComponent(params.search)}`);
  }
  const queryString = query.length ? `?${query.join('&')}` : '';
  const response = await API.get(`/employees${queryString}`);
  return response.data;
};
