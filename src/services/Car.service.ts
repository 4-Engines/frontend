import { axios } from '@/plugins/axios';

function getAllCars(id_user: string) {
  return axios.post('/select-all-cars', {
    id_user,
  });
}

export { getAllCars };
