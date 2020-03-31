import { Schema } from 'mongoose';

export const ContactoSchema = new Schema(
    {
        activo: {
            type: Boolean,
            default: true,
        },
        nombre: {
            type: String,
            required: false
        },
        tipo: {
            type: String,
            enum: ['fijo', 'celular'],
            required: true,
        },
        valor: String,
    },
    {
        _id: false,
        versionKey: false,
        timestamps: true
    }
);
