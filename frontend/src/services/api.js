import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_URL;
let baseURL = '/api';

if (rawBaseUrl) {
  const cleanBase = rawBaseUrl.trim().replace(/\/+$/, '');
  baseURL = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`;
}

const API = axios.create({
  baseURL
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('portal_jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const loginUser = async (credentials) => {
  const res = await API.post('/auth/login', credentials);
  return res.data;
};

export const fetchMe = async () => {
  const res = await API.get('/auth/me');
  return res.data;
};

export const fetchZohoApp = async (appKey) => {
  const res = await API.get(`/zoho/${appKey}`);
  return res.data;
};

export const fetchZohoStatus = async () => {
  const res = await API.get('/zoho/status');
  return res.data;
};

export const fetchUsers = async () => {
  const res = await API.get('/admin/users');
  return res.data;
};

export const createUser = async (userData) => {
  const res = await API.post('/admin/users', userData);
  return res.data;
};

export const updateUserRole = async (userId, roleName) => {
  const res = await API.put(`/admin/users/${userId}/role`, { roleName });
  return res.data;
};

export const toggleUserStatus = async (userId) => {
  const res = await API.patch(`/admin/users/${userId}/status`);
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await API.delete(`/admin/users/${userId}`);
  return res.data;
};

export const fetchRoles = async () => {
  const res = await API.get('/admin/roles');
  return res.data;
};

export const fetchPermissions = async () => {
  const res = await API.get('/admin/permissions');
  return res.data;
};

export const fetchAuditLogs = async () => {
  const res = await API.get('/admin/audit-logs');
  return res.data;
};

export default API;
