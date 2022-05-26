import { User } from "./User";

type DefaultResponse<T = {}> = [
    {
        msj: string;
        status: string;
    } & T,
    number
];

type LoginResponse = DefaultResponse<{
    user: User;
}>;

type CreateUserResponse = DefaultResponse<{
    id: string
}>

export {
    DefaultResponse,
    LoginResponse,
    CreateUserResponse,
}