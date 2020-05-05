import IContacto from './contacto.interface';
import IDireccion from './direccion.interface';
import IPacienteRelacion from './paciente-relacion.interface';
import { EstadoCivil } from '../utils/enums';

export default interface IPaciente {
    id: string;
    documento: string;
    cuil: string;
    activo: boolean;
    estado: string;
    nombre: string;
    apellido: string;
    nombreCompleto: string;
    alias: string;
    contacto: IContacto[];
    sexo: string;
    genero: string;
    tipoIdentificacion: String;
    numeroIdentificacion: String;
    fechaNacimiento: Date; // Fecha Nacimiento
    edad: number;
    edadReal: { valor: number, unidad: string };
    fechaFallecimiento: Date;
    direccion: IDireccion[];
    estadoCivil: EstadoCivil;
    foto: string;
    relaciones: [IPacienteRelacion];
    financiador: [{
        // entidad: {
        //     id: string;
        //     nombre: string
        // };
        // activo: Boolean;
        // fechaAlta: Date;
        // fechaBaja: Date;
        // ranking: Number;
        codigoPuco: Number,
        nombre: string,
        financiador: String,
        id: string,
        numeroAfiliado: String
    }];
    identificadores: [{
        entidad: string,
        valor: string
    }];
    claveBlocking: [string];
    entidadesValidadoras?: [string];
    scan: string;
    reportarError: Boolean;
    notaError: string;
    carpetaEfectores?: [{
        organizacion: {
            id: string,
            nombre: string
        },
        nroCarpeta: string
    }];
    notas?: [{
        fecha: Date,
        nota: string,
        destacada: Boolean
    }];
}
