import { axios } from '@/plugins/axios';

function newAppointment(data: {
  id_owner: string;
  id_car: string;
  date: string;
  time: string;
  comments: string;
}) {
  return axios.post('/solicitar-turno', data);
}

export { newAppointment };
