import apiClient from "./client";

export const productService = {
  getVendorProducts: async (vendorId: string) => {
    const response = await apiClient.get(`/catalog/products/vendor/${vendorId}`);
    return response.data?.data;
  },
  createProduct: async (data: any) => {
    const response = await apiClient.post("/catalog/products", data);
    return response.data?.data;
  },
  updateProduct: async (id: string, data: any) => {
    const response = await apiClient.patch(`/catalog/products/${id}`, data);
    return response.data?.data;
  },
  updateStock: async (id: string, stock: number) => {
    const response = await apiClient.patch(`/catalog/products/${id}/stock`, { stock });
    return response.data?.data;
  },
  deleteProduct: async (id: string) => {
    const response = await apiClient.delete(`/catalog/products/${id}`);
    return response.data?.data;
  },
  getCategories: async () => {
    const response = await apiClient.get("/catalog/categories");
    return response.data?.data;
  },
};
