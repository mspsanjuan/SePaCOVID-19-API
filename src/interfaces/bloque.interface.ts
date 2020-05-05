import ITipoPrestacion from './tipo-prestacion.interface';
import ITurno from './turno.interface';

export default interface IBloque {
    id?: String;
    horaInicio: Date;
    horaFin: Date;
    cantidadTurnos: number;
    duracionTurno: number;
    descripcion: String;
    tipoPrestaciones: ITipoPrestacion[];
    accesoDirectoDelDia: number;
    accesoDirectoDelDiaPorc: number;
    accesoDirectoProgramado: number;
    indice: number;
    reservadoGestion: number;
    reservadoGestionPorc: number;
    reservadoProfesional: number;
    reservadoProfesionalPorc: number;
    restantesDelDia?: number;
    restantesProgramados?: number;
    restantesGestion?: number;
    restantesProfesional?: number;
    pacienteSimultaneos?: Boolean;
    cantidadSimultaneos: number;
    citarPorBloque?: Boolean;
    cantidadBloque: number;
    turnos: ITurno[];
    nominalizada: boolean;
}
