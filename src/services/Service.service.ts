import { axios } from '@/plugins/axios';
import { DefaultResponse } from '@/types/Response';

function newService(data: {
  id_car: string;
  services: number[];
  details: string;
  id_user: string;
}): Promise<DefaultResponse> {
  return axios.post('/create-service', data);
}

export { newService };
