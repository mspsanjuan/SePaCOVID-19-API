import { Schema, model, Document } from 'mongoose';
import { PaisSchema } from '../pais/pais.model';
import { IProvincia } from './provincia.interface';

export const ProvinciaSchema = new Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        pais: {
            type: PaisSchema,
            required: true
        }
    },
    {
        versionKey: false,
    }
);

const Provincia = model<IProvincia & Document>('provincia', ProvinciaSchema, 'provincias');
export default Provincia;
