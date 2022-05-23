import { Rol } from "./Enums"

interface BaseUser {
    id: string,
    name: string,
    last_name: string,
    mail: string,
}

type Cliente = BaseUser & {
    rol: Rol.Cliente
}

interface Taller {
    id: string,
    nombre: string,
    direccion: string
}

type Empleado = BaseUser & {
    rol: Rol.Empleado,
    taller: Taller,
}

type Admin = BaseUser & {
    rol: Rol.Admin,
    taller: Taller
}

type User = Cliente | Empleado | Admin

export {
    Rol,
    User,
    Cliente,
    Empleado,
    Admin
}