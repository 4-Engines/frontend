import { axios } from '@/plugins/axios';
import { AxiosResponse } from 'axios';

type DefaultResponse = [
  {
    msj: string;
    status: string;
  },
  number
];

type LoginResponse = [
  {
    msj: string;
    rol: number;
    status: string;
  },
  number
];

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
  return axios.post('/create-user', {
    ...data,
    rol: 1,
  });
}

async function logoutUser(): Promise<void> {
  return axios.get('/logout');
}

async function confirmUser(id: string): Promise<void> {
  return axios.get(`/confirm/${id}`);
}

export { loginUser, createUser, logoutUser, confirmUser };
