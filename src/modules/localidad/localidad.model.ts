import { Schema, model, Document } from 'mongoose';
import { DepartamentoSchema } from '../departamento/departamento.schema';
import ILocalidad from './localidad.interface';

const LocalidadSchema = new Schema (
    {
        nombre: {
            type: String,
            required: true
        },
        codigoPostal: {
            type: String,
            required: true
        },
        departamento: {
            type: DepartamentoSchema,
            required: false
        }
    },
    {
        versionKey: false,
    }
);

const Localidad = model<ILocalidad & Document>('localidad', LocalidadSchema, 'localidades');
export default Localidad;
