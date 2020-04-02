import { Schema, model, Document } from 'mongoose';
import IDepartamento from './departamento.interface';
import { ProvinciaSchema } from '../provincia/provincia.model';

export const DepartamentoSchema = new Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        codigo: {
            type: String,
            required: true,
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

const Departamento = model<IDepartamento & Document>('departamento', DepartamentoSchema, 'departamentos');
export default Departamento;
