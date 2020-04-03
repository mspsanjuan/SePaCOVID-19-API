import IDepartamento from '../departamento/departamento.interface';

export default interface ILocalidad {
    id?: string;
    nombre: string;
    codigo: string;
    departamento: IDepartamento;
}
