import { axios } from '@/plugins/axios';

function newAppointment(data: {
  user: string;
  fecha: string;
  hora: string;
  carid: string;
}) {
  return axios.post('/turno-select', data);
}

export { newAppointment };
