import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as cookieParser from 'cookie-parser';
import { listen } from 'socket.io';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';
// import * as cors from 'cors';

class App {
    public app: express.Application;

    constructor(controllers: Controller[]) {
        this.app = express();

        this.connectToTheDatabase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    public listen() {
        const {
            PORT,
        } = process.env;

        this.app.listen(PORT, () => {
            // tslint:disable-next-line:no-console
            console.log(`App listening on the port ${process.env.PORT}`);
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
            this.app.use('/api', controller.router);
        });
    }

    private connectToTheDatabase() {
        const {
            MONGO_USER,
            MONGO_PASSWORD,
            MONGO_PATH,
        } = process.env;

        mongoose.plugin(schema => {
            schema.set('toJSON', {
                virtuals: true,
                versionKey: false
            });
        });

        const ops: mongoose.ConnectionOptions = {
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 500,
        };
        if (MONGO_USER && MONGO_PASSWORD) {
            mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`, ops);
        } else {
            mongoose.connect(`mongodb://${MONGO_PATH}`, ops);
        }
    }
}

export default App;
