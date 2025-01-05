import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && !config.url?.startsWith('/auth')) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Auth
  login: async (data: any) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // Person
  getPersons: async () => {
    const response = await api.get('/person');
    return response.data;
  },

  getPerson: async (id: number) => {
    const response = await api.get(`/person/${id}`);
    return response.data;
  },

  createPerson: async (data: any) => {
    const response = await api.post('/person', data);
    return response.data;
  },

  updatePerson: async (id: number, data: any) => {
    const response = await api.put(`/person/${id}`, data);
    return response.data;
  },

  deletePerson: async (id: number) => {
    const response = await api.delete(`/person/${id}`);
    return response.data;
  },

  // Address
  removeAddressFromPerson: async (personId: number, addressId: number) => {
    const response = await api.delete(`/person/${personId}/address/${addressId}`);
    return response.data;
  },

  // Invoice
  getInvoices: async () => {
    const response = await api.get('/invoice');
    return response.data;
  },

  getInvoice: async (id: number) => {
    const response = await api.get(`/invoice/${id}`);
    return response.data;
  },

  createInvoice: async (data: any) => {
    const response = await api.post('/invoice', data);
    return response.data;
  },

  updateInvoice: async (id: number, data: any) => {
    const response = await api.put(`/invoice/${id}`, data);
    return response.data;
  },

  deleteInvoice: async (id: number) => {
    const response = await api.delete(`/invoice/${id}`);
    return response.data;
  },

  addInvoiceToMultiplePersons: async (invoiceId: number, personIds: number[]) => {
    const response = await api.post(`/invoice/${invoiceId}/persons`, { personIds });
    return response.data;
  },

  removeInvoiceFromMultiplePersons: async (invoiceId: number, personIds: number[]) => {
    const response = await api.delete(`/invoice/${invoiceId}/persons`, {
      data: { personIds },
    });
    return response.data;
  },

  getClassifications: async () => {
    const response = await api.get('/classification');
    return response.data;
  },

  createClassification: async (data: { name: string; enable: boolean }) => {
    const response = await api.post('/classification', data);
    return response.data;
  },

  updatePersonInvoice: async (
    invoiceId: number,
    personId: number,
    data: {
      paid_at?: string | null; // Ajuste para string | null
      cancelled_at?: string | null; // Ajuste para string | null
      enable?: boolean;
    }
  ) => {
    const response = await api.patch(
      `/invoice/${invoiceId}/person/${personId}`,
      data
    );
    return response.data;
  },

};