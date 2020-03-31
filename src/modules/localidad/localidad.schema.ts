import { Schema, model, Document } from 'mongoose';
import ILocalidad from './localidad.interface';
import { ProvinciaSchema } from '../provincia/provincia.model';

export const LocalidadSchema = new Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        provincia: {
            type: ProvinciaSchema,
            required: true
        },
    },
    {
        versionKey: false
    }
);

const Localidad = model<ILocalidad & Document>('localidad', LocalidadSchema, 'localidades');
export default Localidad;
