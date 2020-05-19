import IPrestacionRegistro from './prestacion-registro.interface';
import IProfesional from './profesional.interface';

export default interface ISeguimientoPaciente {
    id?: string; // Virtual
    paciente: {
        id: string;
        nombre: string;
        apellido: string;
        documento: string;
        sexo: string;
        fechaNacimiento: Date;
    };
    registro: IPrestacionRegistro;
    profesional: IProfesional;
}
