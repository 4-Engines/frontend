import type { AxiosResponse } from 'axios';
import type { Appointment } from './Appointment';
import type { Car } from './Car';
import type { Service } from './Service';
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

type GetCarResponse = DefaultResponse<{
  car: Car;
  services: Service[];
  turnos: Appointment[];
}>;

type SelectAllTurnosResponse = DefaultResponse<{
  turnos: [
    {
      fecha: string;
      turnos: Record<string, boolean>;
    }
  ];
}>;

export {
  DefaultResponse,
  LoginResponse,
  CreateUserResponse,
  ConfirmUserResponse,
  GetAllCarsResponse,
  GetMyCarResponse,
  GetCarResponse,
  SelectAllTurnosResponse,
};
