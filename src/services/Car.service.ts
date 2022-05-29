import { axios } from '@/plugins/axios';
import type { DefaultResponse } from '@/types/Response';

async function createCar(data: {
  carid: string;
  marca: string;
  model: string;
  year: string;
  owner: string;
  id_user?: string;
}): Promise<DefaultResponse> {
  return axios.post('/create-car', data);
}

export { createCar };
