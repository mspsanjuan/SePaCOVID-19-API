import { Schema } from 'mongoose';
import { DepartamentoSchema } from '../departamento/departamento.schema';

export const DireccionSchema = new Schema(
    {
        activo: {
            type: Boolean,
            default: true
        },
        calle: {
            type: String,
            uppercase: true,
            required: true,
        },
        numero: {
            type: Number,
            required: true,
        },
        orientacion: {
            type: String,
            enum: ['norte', 'sur', 'este', 'oeste'],
            required: true
        },
        codigoPostal: {
            type: Number,
            required: true
        },
        departamento: {
            type: DepartamentoSchema,
            required: true
        },
    },
    {
        _id: false,
        versionKey: false,
        timestamps: true
    }
);
