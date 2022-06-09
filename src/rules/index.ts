function required(value: string) {
  return !!value || 'Campo requerido';
}

function email(value: string) {
  const pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(value) || 'Dirección de mail inválida';
}

function onlyNumbers(value: string | number) {
  return /^\d+$/.test(value.toString()) || 'Solo se admiten números';
}

function min3(value: string) {
  return value.length > 3 || 'El campo debe tener como mínimo tres caracteres';
}

export { required, email, onlyNumbers, min3 };
