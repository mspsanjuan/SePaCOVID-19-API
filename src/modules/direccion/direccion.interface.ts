import IPais from '../pais/pais.interface';
import ILocalidad from '../localidad/localidad.interface';

export default interface IDireccion {
    activo?: Boolean;
    calle: String;
    numero: Number;
    orientacion: 'norte' | 'sur' | 'este' | 'oeste';
    codigoPostal: Number;
    localidad: ILocalidad;
}
