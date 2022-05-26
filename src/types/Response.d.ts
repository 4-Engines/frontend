import { User } from "./User";

type DefaultResponse = [
    {
        msj: string;
        status: string;
    },
    number
];

type LoginResponse = [
    {
        msj: string;
        status: string;
        user: User;
    },
    number
];

export {
    DefaultResponse,
    LoginResponse
}