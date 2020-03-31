import 'dotenv/config';
import App from './app';
import validateEnv from './utils/validateEnv';
// Controllers
import UserController from './modules/user/user.controller';
import AuthenticationController from './modules/autentication/autentication.controller';
import StatusController from './modules/status/status.controller';

validateEnv();

const app = new App(
    [
        new StatusController(),
        new AuthenticationController(),
        new UserController(),
    ],
);

app.listen();
