import HttpService from './http.service';
import IAgenda from '../interfaces/agenda.interface';

export interface IGetAgendaResponse {
    code: number;
    text: string;
    data?: IAgenda[];
}

export interface IPostAgendaResponse {
    code: number;
    text: string;
    data?: IAgenda;
}

export class AgendaService extends HttpService {
    protected baseUrl = 'modules/turnos/agenda';

    public async get(fechaDesde: Date, fechaHasta: Date, idProfesional: string): Promise<IGetAgendaResponse> {
        const res: IGetAgendaResponse = await this._get('', {
            fechaDesde: fechaDesde.toString(),
            fechaHasta: fechaHasta.toString(),
            idProfesional,
        });
        return res;
    }

    public async post(agenda: IAgenda) {
        const res: IPostAgendaResponse = await this._post('', agenda);
        return res;
    }
}

const agendaService = new AgendaService();
export default agendaService;
