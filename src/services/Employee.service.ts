import { axios } from '@/plugins/axios';
import type { DefaultResponse } from '@/types/Response';
import type { AxiosResponse } from 'axios';

async function createEmployee(data: {
  username: string;
  password: string;
  name: string;
  lastname: string;
  phone: number;
  email: string;
}): Promise<AxiosResponse<DefaultResponse>> {
  return axios.post('/create-user', data);
}

export { createEmployee };
