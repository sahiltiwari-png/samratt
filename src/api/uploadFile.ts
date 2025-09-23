import API from './auth';

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await API.post('/file-upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  // Use fileUrl from the response
  return response.data.fileUrl;
};
