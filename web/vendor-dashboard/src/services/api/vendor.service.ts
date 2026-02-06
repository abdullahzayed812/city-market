import apiClient from "./client";

export const vendorService = {
  getMyProfile: async () => {
    const response = await apiClient.get("/vendors/me");
    return response.data?.data;
  },
  updateProfile: async (id: string, data: any) => {
    const response = await apiClient.patch(`/vendors/${id}`, data);
    return response.data?.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await apiClient.patch(`/vendors/${id}/status`, { status });
    return response.data?.data;
  },
  setWorkingHours: async (id: string, workingHours: any[]) => {
    const response = await apiClient.post(`/vendors/${id}/working-hours`, workingHours);
    return response.data?.data;
  },
  getWorkingHours: async (id: string) => {
    const response = await apiClient.get(`/vendors/${id}/working-hours`);
    return response.data?.data;
  },
  uploadImage: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await apiClient.post(`/vendors/${id}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data?.data;
  },
};
