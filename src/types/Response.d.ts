import type { AxiosResponse } from 'axios';
import { Car } from './Car';
import type { User } from './User';

type DefaultResponse<T = {}> = AxiosResponse<
  [
    {
      msj: string;
      status: string;
    } & T,
    number
  ]
>;

type LoginResponse = DefaultResponse<{
  user: User;
}>;

type CreateUserResponse = DefaultResponse<{
  id: string;
}>;

type ConfirmUserResponse = DefaultResponse<{
  email: string;
  username: string;
}>;

type GetAllCarsResponse = DefaultResponse<{
  cars: Car[];
}>;

type GetMyCarResponse = DefaultResponse<{
  cars: Car[];
}>;

export {
  DefaultResponse,
  LoginResponse,
  CreateUserResponse,
  ConfirmUserResponse,
  GetAllCarsResponse,
  GetMyCarResponse,
};
