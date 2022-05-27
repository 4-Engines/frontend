import type { AxiosResponse } from 'axios';
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

export {
  DefaultResponse,
  LoginResponse,
  CreateUserResponse,
  ConfirmUserResponse,
};
