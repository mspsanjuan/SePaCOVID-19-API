import IPersona from '../persona/persona.interface';

export default interface IUser {
    id?: string;
    username: string;
    password?: string;
    personalData: IPersona;
    lastLogin?: Date;
    permissions?: string[];
}
