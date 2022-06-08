import { axios } from '@/plugins/axios';

function newService(data: {
  id_auto: string;
  comments: string;
  amount: number;
}) {
  return axios.post('/nuevo-servicio', data);
}

export { newService };
