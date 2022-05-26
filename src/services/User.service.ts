import { axios } from '@/plugins/axios';
import type { AxiosResponse } from 'axios';
import type { DefaultResponse, LoginResponse } from '@/types/Response';

async function loginUser(data: {
  username: string;
  password: string;
}): Promise<AxiosResponse<LoginResponse>> {
  return axios.post('/login', data);
}

async function createUser(data: {
  username: string;
  password: string;
  name: string;
  lastname: string;
  phone: string;
  email: string;
}): Promise<AxiosResponse<DefaultResponse>> {
  return axios.post('/create-user', data);
}

async function logoutUser(): Promise<void> {
  return axios.get('/logout');
}

async function confirmUser(id: string): Promise<AxiosResponse<DefaultResponse>> {
  return axios.get(`/confirm/${id}`);
}

export { loginUser, createUser, logoutUser, confirmUser };
