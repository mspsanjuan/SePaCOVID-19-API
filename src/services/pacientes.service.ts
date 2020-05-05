import HttpService from './http.service';
import { IPaciente } from '../interfaces/paciente.interface';

export interface IPacienteResponse {
    code: number;
    text: string;
    data?: IPaciente[];
}

export class PacienteService extends HttpService {
    protected baseUrl = 'core/mpi/pacientes';

    public async get(params): Promise<IPacienteResponse> {
        const res: IPacienteResponse = await this._get('', {type: 'simplequery', ...params});
        return res;
    }
}
const pacienteService = new PacienteService();
export default pacienteService;
