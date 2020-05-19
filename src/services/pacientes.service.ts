import HttpService, { IHttpResponse } from './http.service';
import IPaciente from '../interfaces/paciente.interface';

export class PacienteService extends HttpService {
    protected baseUrl = 'core/mpi/pacientes';

    public async get(params) {
        const res = await this._get<IPaciente[]>('', {type: 'simplequery', ...params});
        return res;
    }
}
const pacienteService = new PacienteService();
export default pacienteService;
