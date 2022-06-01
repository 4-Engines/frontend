import { axios } from '@/plugins/axios';

function getAllCars(id_user: string) {
  return axios.post('/select-all-car', {
    id_user,
  });
}

export { getAllCars };
