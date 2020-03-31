export default interface IContacto {
    activo?: Boolean;
    nombre?: String;
    valor?: String;
    tipo: 'fijo' | 'celular';
}
