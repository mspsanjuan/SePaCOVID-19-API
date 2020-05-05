import ITipoPrestacion from './tipo-prestacion.interface';
import IBloque from './bloque.interface';
import ITurno from './turno.interface';

export default interface IAgenda {
    id?: string;
    tipoPrestaciones: ITipoPrestacion[];
    // profesionales: IProfesional[];
    profesionales: [{
        id: string,
        nombre: string,
        apellido: string
    }];
    organizacion: {
        id: string,
        nombre: string,
        _id?: string
    };
    espacioFisico: {
        id: string,
        nombre: string,
        servicio: {
            id: string,
            nombre: string
        };
        sector: {
            id: string,
            nombre: string
        };
    };
    fecha: Date;
    horaInicio: Date;
    horaFin: Date;
    intercalar?: Boolean;
    bloques: IBloque[];
    estado?: string;
    prePausada?: string;
    sobreturnos?: ITurno[];
    turnosDisponibles?: number; // Virtual
    turnosRestantesDelDia?: number; // Virtual
    turnosRestantesProgramados?: number; // Virtual
    turnosRestantesGestion?: number; // Virtual
    turnosRestantesProfesional?: number; // Virtual
    estadosAgendas?: string[];
    nota?: string;
    nominalizada: Boolean;
    dinamica: Boolean;
    cupo: Number;
    avisos?: [{
        profenionalId: string,
        estado: string,
        fecha: Date
    }];
}
