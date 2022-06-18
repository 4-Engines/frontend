import { axios } from '@/plugins/axios';
import { DefaultResponse, SelectAllTurnosResponse } from '@/types/Response';

function newAppointment(data: {
  user: string;
  fecha: string;
  hora: string;
  carid: string;
}): Promise<DefaultResponse> {
  return axios.post('/turno-select', data);
}

function selectAllTurnos(data: {
  user: string;
  fecha: string;
}): Promise<SelectAllTurnosResponse> {
  return axios.post('/select-all-turnos', data);
}

export { newAppointment, selectAllTurnos };
