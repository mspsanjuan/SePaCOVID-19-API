import IPais from '../pais/pais.interface';

export interface IProvincia {
    id?: string;
    nombre: string;
    pais: IPais;
}
