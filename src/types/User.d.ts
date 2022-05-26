import { Rol } from './Enums';
import type { Taller } from './Taller';

interface BaseUser {
  id: string;
  name: string;
  lastname: string;
  mail: string;
  username: string;
  phone: string;
}

type Cliente = BaseUser & {
  rol: Rol.Cliente;
};

type Empleado = BaseUser & {
  rol: Rol.Empleado;
  taller: Taller;
};

type Admin = BaseUser & {
  rol: Rol.Admin;
  taller: Taller;
};

type User = Cliente | Empleado | Admin;

export { Rol, User, Cliente, Empleado, Admin };
