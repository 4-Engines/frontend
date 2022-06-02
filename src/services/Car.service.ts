import { axios } from '@/plugins/axios';
import type { GetAllCarsResponse } from '@/types/Response';

function getAllCars(id_user: string): Promise<GetAllCarsResponse> {
  return axios.post('/select-all-cars', {
    id_user,
  });
}

export { getAllCars };
