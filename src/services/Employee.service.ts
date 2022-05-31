import { axios } from '@/plugins/axios';
import type { CreateUserResponse } from '@/types/Response';

async function createEmployee(data: {
  username: string;
  password: string;
  name: string;
  lastname: string;
  phone: number;
  email: string;
}): Promise<CreateUserResponse> {
  return axios.post('/create-user', data);
}

export { createEmployee };
