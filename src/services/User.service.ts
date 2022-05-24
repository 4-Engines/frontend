import { axios } from '@/plugins/axios';
import { AxiosResponse } from 'axios';

type DefaultResponse = [
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
}): Promise<AxiosResponse<DefaultResponse>> {
  return axios.post('/login', data);
}

async function createUser(data: {
  username: string;
  password: string;
  lastname: string;
  name: string;
  phone: string;
  email: string;
}): Promise<void> {
  return axios.post('/create-user', {
    ...data,
    rol: 1
  });
}

async function logoutUser(): Promise<void> {
  return axios.get('/logout');
}

export { loginUser, createUser, logoutUser };
