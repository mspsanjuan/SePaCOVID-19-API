import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as cookieParser from 'cookie-parser';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';
import connections from './connections';
import { PORTS } from '../config.private';
// import * as cors from 'cors';

class App {
    public app: express.Application;

    constructor(controllers: Controller[]) {
        this.app = express();

        // connections.initializeDataBase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    public listen() {
        this.app.listen(PORTS.main, () => {
            // tslint:disable-next-line:no-console
            console.log(`\x1b[45mAPI corriendo en http://127.0.0.1/${PORTS.main}\x1b[0m`);
        });
    }

    private initializeMiddlewares() {
        // const corsOp: cors.CorsOptions = {
        //     origin: 'http://localhost:3100',
        //     credentials: true,
        // }
        // this.app.use(cors(corsOp));
        this.app.use(cookieParser());
        this.app.use(bodyParser.json());
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/sepacovid', controller.router);
        });
    }
}

export default App;
