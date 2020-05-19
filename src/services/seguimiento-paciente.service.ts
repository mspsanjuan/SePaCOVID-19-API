import HttpService from './http.service';
import IAgenda from '../interfaces/agenda.interface';
import ISeguimientoPaciente from '../interfaces/seguimiento-paciente.interface';

export class SeguimientoPacienteService extends HttpService {
    protected baseUrl = 'modules/seguimiento-paciente/';

    public async post(seguimientoPaciente: ISeguimientoPaciente) {
        const res = await this._post<ISeguimientoPaciente>('', seguimientoPaciente);
        return res;
    }
}

const seguimientoPacienteService = new SeguimientoPacienteService();
export default seguimientoPacienteService;
