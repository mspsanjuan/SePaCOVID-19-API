import IPais from '../pais/pais.interface';
import IDireccion from '../direccion/direccion.interface';
import IContacto from '../contacto/contacto.interface';

export default interface IPersona {
    id?: string;
    nombre: string;
    apellido: string;
    sexo: 'masculino' | 'femenino';
    documento: string;
    fechaNacimiento: Date;
    nacionalidad?: IPais;
    direccion?: IDireccion;
    contactoPersonal?: IContacto[];
    contactoEmergencia?: IContacto[];
    edad?: number;
    nombreCompleto?: string;
}
