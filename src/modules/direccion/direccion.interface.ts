import IPais from '../pais/pais.interface';
import IDepartamento from '../departamento/departamento.interface';

export default interface IDireccion {
    activo?: Boolean;
    calle: string;
    numero: Number;
    orientacion: 'norte' | 'sur' | 'este' | 'oeste';
    codigoPostal: Number;
    departamento: IDepartamento;
}
