import { Router, NextFunction, Request, Response } from 'express';
import Controller from '../../interfaces/controller.interface';

export default class AutoDiagnostico implements Controller {
    path = 'autodiagnostico';
    router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('', this.postRegisterData);
    }

    private postRegisterData = async (request: Request, response: Response, next: NextFunction) => {

    }
}
