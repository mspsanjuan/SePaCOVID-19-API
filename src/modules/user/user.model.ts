import { Schema, model, Document } from 'mongoose';
import IUser from './user.interface';

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
        permissions: [String],
        lastLogin: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

const User = model<IUser & UserDocument>('user', UserSchema, 'users');

export default User;
