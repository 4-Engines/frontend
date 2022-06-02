import { axios } from '@/plugins/axios';
import type { DefaultResponse, GetAllCarsResponse } from '@/types/Response';

function getAllCars(id_user: string): Promise<GetAllCarsResponse> {
  return axios.post('/select-all-cars', {
    id_user,
  });
}

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

export { getAllCars, createCar };
