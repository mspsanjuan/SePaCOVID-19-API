import { Router, NextFunction, Request, Response } from 'express';
import Controller from '../../interfaces/controller.interface';
import { API_TOKEN, API_URL } from '../../../config.private';
import HttpException from '../../exceptions/HttpException';
import pacienteService from '../../services/pacientes.service';

export default class AutoDiagnostico implements Controller {
    public path = '/autodiagnostico';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}`, this.postRegisterData);
    }

    private postRegisterData = async (request: Request, response: Response, next: NextFunction) => {
        const pacienteQuery = request.body.paciente;
        const profesionalQuery = request.body.profesional;

        try {
            const resPaciente = await pacienteService.get(pacienteQuery);
            response.send(resPaciente.data);
        } catch (err) {
            next(new HttpException(400, err));
        }
    }
}
