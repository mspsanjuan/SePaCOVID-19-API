import { IProvincia } from '../provincia/provincia.interface';

export default interface IDepartamento {
    id?: String;
    nombre: String;
    provincia: IProvincia;
}
