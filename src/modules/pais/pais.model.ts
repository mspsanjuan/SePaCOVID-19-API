import { Schema, Document, model } from 'mongoose';
import IPais from './pais.interface';

export const PaisSchema = new Schema(
    {
        nombre: String,
    },
    {
        versionKey: false
    }
);

const Pais = model<IPais & Document>('pais', PaisSchema, 'paises');
export default Pais;

