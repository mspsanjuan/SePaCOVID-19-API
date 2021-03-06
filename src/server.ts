import App from './app';
// Controllers
import UserController from './modules/user/user.controller';
import AuthenticationController from './modules/autentication/autentication.controller';
import StatusController from './modules/status/status.controller';
import AutoDiagnosticoController from './modules/auto-diagnostico/auto-diagnostico.controller';

const app = new App(
    [
        new StatusController(),
        new AuthenticationController(),
        new UserController(),
        new AutoDiagnosticoController(),
    ],
);

app.listen();
