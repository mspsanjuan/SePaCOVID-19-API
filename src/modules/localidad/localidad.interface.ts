import { IProvincia } from '../provincia/provincia.interface';

export default interface ILocalidad {
    id?: String;
    nombre: String;
    provincia: IProvincia;
}
