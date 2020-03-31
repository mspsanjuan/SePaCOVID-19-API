import IPais from '../pais/pais.interface';

export interface IProvincia {
    id?: String;
    nombre: String;
    pais: IPais;
}
