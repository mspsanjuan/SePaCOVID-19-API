import HttpService, { IHttpResponse } from './http.service';
import IPaciente from '../interfaces/paciente.interface';

export interface IPacienteValidation {
    existente: boolean;
    paciente: IPaciente;
    validado: boolean;
}

export class PacienteService extends HttpService {
    protected baseUrl = 'core/mpi/pacientes/';

    public async get(params) {
        const res = await this._get<IPaciente[]>('', {type: 'simplequery', ...params});
        return res;
    }

    public async validar(paciente: IPaciente) {
        const res = await this._post<IPacienteValidation>('validar', paciente);
        return res;
    }

    public async post(paciente: IPaciente) {
        const res = await this._post<IPaciente>('', {
            ignoreCheck: true,
            incluirTemporales: false,
            paciente,
        });
        return res;
    }
}
const pacienteService = new PacienteService();
export default pacienteService;
