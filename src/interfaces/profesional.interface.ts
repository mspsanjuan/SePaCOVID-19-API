import IUbicacion from './ubicacion.interface';
import { Sexo, Genero, TipoComunicacion, EstadoCivil } from '../utils/enums';

export default interface IProfesional {
    id: string;
    documento: string;
    activo: Boolean;
    nombre: string;
    apellido: string;
    contacto: [{
        tipo: TipoComunicacion,
        valor: string,
        ranking: Number, // Specify preferred order of use (1 = highest) // Podemos usar el rank para guardar un historico de puntos de contacto (le restamos valor si no es actual???)
        ultimaActualizacion: Date,
        activo: Boolean
    }];
    sexo: Sexo;
    genero: Genero; // identidad autopercibida
    fechaNacimiento: Date; // Fecha Nacimiento
    fechaFallecimiento: Date;
    direccion: [{
        valor: string,
        codigoPostal: string,
        ubicacion: IUbicacion,
        ranking: Number,
        geoReferencia: {
            type: [Number], // [<longitude>, <latitude>]
            index: '2d' // create the geospatial index
        },
        ultimaActualizacion: Date,
        activo: Boolean
    }];
    estadoCivil: EstadoCivil;
    foto: string;
    rol: string; // Ejemplo Jefe de Terapia intensiva
    especialidad: [{ // El listado de sus especialidades
        id: string,
        nombre: string
    }];
    matriculas: [{
        numero: Number,
        descripcion: string,
        fechaInicio: Date,
        fechaVencimiento: Date,
        activo: Boolean
    }];
    profesionalMatriculado: Boolean;
}
