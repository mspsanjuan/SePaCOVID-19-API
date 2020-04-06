import { Schema, model, Document } from 'mongoose';
import IUser from './user.interface';
import { PersonaSchema } from '../persona/persona.model';

export interface UserDocument extends Document {
    /**
     * Datos basicos del usuario
     */
    basicData: () => IUser;
}

export const UserSchema = new Schema<UserDocument>(
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        personalData: {
            type: PersonaSchema,
            required: false
        },
        permissions: [String],
        lastLogin: Date,
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

UserSchema.methods.basicData = function () {
    return {
        id: this._id,
        username: this.username,
        personalData: this.personalData.basicData(),
    };
};

const User = model<IUser & UserDocument>('user', UserSchema, 'users');

export default User;
