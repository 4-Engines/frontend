import { axios } from '@/plugins/axios';
import type {
  DefaultResponse,
  GetAllCarsResponse,
  GetCarResponse,
  GetMyCarResponse,
} from '@/types/Response';

function getAllCars(id_user: string): Promise<GetAllCarsResponse> {
  return axios.post('/select-all-cars', {
    id_user,
  });
}

function getMyCars(id_owner: string): Promise<GetMyCarResponse> {
  return axios.post('/select-my-car', {
    id_owner,
  });
}

function createCar(data: {
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

function getCar(id_car: string): Promise<GetCarResponse> {
  return axios.post('/get-car', {
    id_car,
  });
}

export { getAllCars, getMyCars, createCar, getCar };
