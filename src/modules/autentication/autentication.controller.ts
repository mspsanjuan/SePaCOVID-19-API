import * as express from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import User from '../user/user.model';
import Persona from '../persona/persona.model';

import IUser from '../user/user.interface';
import ILogin from './autentication.interface';

import Controller from '../../interfaces/controller.interface';
import DataStoredInToken from '../../interfaces/dataInStoredToken.interface';
import TokenData from '../../interfaces/tokenData.interface';

import HttpException from '../../exceptions/HttpException';
import WrongCredentialsException from '../../exceptions/WrongCredentialsException';

import authMiddleware from '../../middleware/auth.middleware';
import configuration from '../../../config.private';

class AuthenticationController implements Controller {
    public path = '/auth';
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, this.registration);
        this.router.post(`${this.path}/login`, this.loggingIn);
        this.router.post(`${this.path}/logout`, this.loggingOut);
        this.router.get(`${this.path}/checkAuth`, authMiddleware, this.checkAuth);
    }

    private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const userData: IUser = request.body;
        // Borramos los permisos por si alguien se los quiere autoasignar
        userData.permissions = undefined;
        // Buscamos al usuario por su nick
        try {
            if (await User.findOne({ email: userData.email })) {
                next(new HttpException(400, `El email ${userData.email} ya se encuentra registrado`));
            } else {
                // Creamos a la persona
                let persona = new Persona(userData.personalData);
                persona = await persona.save();
                // Reemplazamos los datos de la persona
                userData.personalData = persona;
                // Hasheamos la contraseña
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                userData.password = hashedPassword;
                // Creamos el user
                let user = new User(userData);
                user = await user.save();
                // Generamos el Token
                const tokenData = this.createToken(user);
                response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);

                response.send(user.basicData());
            }
        } catch (err) {
            next(new HttpException(400, err));
        }
    }

    private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const logInData: ILogin = request.body;
        const user = await User.findOne({ email: logInData.email });
        if (user) {
            const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
            if (isPasswordMatching) {
                user.password = undefined;
                const tokenData = this.createToken(user);
                response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
                response.send(user.basicData());
            } else {
                next(new WrongCredentialsException());
            }
        } else {
            next(new WrongCredentialsException());
        }
    }

    private createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; Path=/`;
    }

    private loggingOut = (request: express.Request, response: express.Response) => {
        response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
        response.send(200);
    }

    private checkAuth = (request: any, response: express.Response) => {
        response.json(request.user);
    }

    private createToken(user: IUser): TokenData {
        const expiresIn = 24 * 60 * 60; // Expira en un dia
        const secret = configuration.jwt.secret;
        const dataStoredInToken: DataStoredInToken = {
            id: user.id,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }
}

export default AuthenticationController;
