import * as express from 'express';
import { connection } from 'mongoose';
import Controller from '../../interfaces/controller.interface';
import authMiddleware from '../../middleware/auth.middleware';
import permissionsMiddleware from '../../middleware/permissions.middleware';

const connectionStates = [
    'DESCONECTADO',
    'OK',
    'CONECTANDO...',
    'DESCONECTANDO...'
];

class StatusController implements Controller {
    public path = '/status';
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, authMiddleware, permissionsMiddleware('status:view'), (req, res) => {
            res.json({
                API: 'OK',
                DB: connectionStates[connection.readyState],
            });
        });
    }
}

export default StatusController;
