import { apiRequest } from '@/lib/api-client';
import type { LoginResponse, RegisterResponse, User } from '@/types/api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
  storeName: string;
}

export const authService = {
  login: (payload: LoginPayload) =>
    apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      authenticated: false,
      body: JSON.stringify(payload)
    }),
  register: (payload: RegisterPayload) =>
    apiRequest<RegisterResponse>('/auth/register', {
      method: 'POST',
      authenticated: false,
      body: JSON.stringify(payload)
    }),
  profile: () => apiRequest<User>('/users/me'),
  updateProfile: (payload: { name: string }) =>
    apiRequest<User>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(payload)
    }),
  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    apiRequest<{ updated: boolean }>('/users/me/password', {
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
};
