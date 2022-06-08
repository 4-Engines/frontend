import { axios } from '@/plugins/axios';

function newService(data: {
  id_car: string;
  service: string;
  details: string;
  id_user: string;
}) {
  return axios.post('/create-service', data);
}

export { newService };
