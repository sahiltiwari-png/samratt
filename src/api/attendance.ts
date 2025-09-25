import API from './auth';

export const getAttendance = async (params?: {
  page?: number;
  limit?: number;
  status?: string | null;
  date?: string | null;
}) => {
  const query = [];
  if (params) {
    if (params.page) query.push(`page=${params.page}`);
    if (params.limit) query.push(`limit=${params.limit}`);
    if (params.status) query.push(`status=${params.status}`);
    if (params.date) query.push(`date=${params.date}`);
  }
  const queryString = query.length ? `?${query.join('&')}` : '';
  const response = await API.get(`/attendance${queryString}`);
  return response.data;
};