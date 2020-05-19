import HttpService from './http.service';
import IAgenda from '../interfaces/agenda.interface';

export class AgendaService extends HttpService {
    protected baseUrl = 'modules/turnos/agenda/';

    public async get(fechaDesde: Date, fechaHasta: Date, idProfesional: string) {
        const res = await this._get<IAgenda[]>('', {
            fechaDesde: fechaDesde.toString(),
            fechaHasta: fechaHasta.toString(),
            idProfesional,
        });
        return res;
    }

    public async post(agenda: IAgenda) {
        const res = await this._post<IAgenda>('', agenda);
        return res;
    }

    public async patch(agenda: IAgenda, op: 'publicada', estado: 'publicada') {
        const res = await this._patch<IAgenda>(agenda.id, {
            op,
            estado,
        });
        return res;
    }
}

const agendaService = new AgendaService();
export default agendaService;
