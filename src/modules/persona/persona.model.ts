import { Schema, model, Document } from 'mongoose';
import { PaisSchema } from '../pais/pais.model';
import { ContactoSchema } from '../contacto/contacto.model';
import { DireccionSchema } from '../direccion/direccion.model';
import IPersona from './persona.interface';

export interface PersonaDocument extends Document {
    /**
     * Datos básicos de una persona
     */
    basicData: () => {
        id: string;
        nombre: string;
        apellido: string;
        sexo: string;
        documento: string;
        fechaNacimiento: Date;
    };
}

export const PersonaSchema = new Schema<PersonaDocument>(
    {
        nombre: {
            type: String,
            uppercase: true,
            required: true,
        },
        apellido: {
            type: String,
            uppercase: true,
            required: true,
        },
        sexo: {
            type: String,
            enum: ['masculino', 'femenino'],
            required: true
        },
        documento: {
            type: String,
            required: true
        },
        fechaNacimiento: {
            type: Date,
            required: true,
        },
        nacionalidad: {
            type: PaisSchema,
            required: true,
        },
        direccion: {
            type: DireccionSchema,
            required: true
        },
        contactoPersonal: {
            type: [ContactoSchema],
            required: true
        },
        contactoEmergencia: {
            type: [ContactoSchema],
            required: true
        },
    },
    {
        versionKey: false,
        timestamps: true
    }
);

PersonaSchema.virtual('nombreCompleto').get(function () {
    return `${this.nombre} ${this.apellido}`;
});

PersonaSchema.virtual('edad').get(function () {
    let edad = 0;
    if (this.fechaNacimiento) {
        const birthDate = new Date(this.fechaNacimiento);
        const currentDate = new Date();
        let years = (currentDate.getFullYear() - birthDate.getFullYear());
        if (currentDate.getMonth() < birthDate.getMonth() ||
            currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate()) {
            years--;
        }
        edad = years;
    }
    return edad;
});

PersonaSchema.methods.basicData = function () {
    return {
        id: this._id,
        nombre: this.nombre,
        apellido: this.apellido,
        sexo: this.sexo,
        documento: this.documento,
        fechaNacimiento: this.fechaNacimiento,
    };
};

const Persona = model<IPersona & PersonaDocument>('persona', PersonaSchema, 'personas');
export default Persona;
