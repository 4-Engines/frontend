import { axios } from '@/plugins/axios';
import type { DefaultResponse } from '@/types/Response';

async function createCar(data: {
  carid: string;
  brand: string;
  model: string;
  year: string;
  color: string;
  owner: string;
  id_user?: string;
}): Promise<DefaultResponse> {
  return axios.post('/create-car', data);
}

export { createCar };
