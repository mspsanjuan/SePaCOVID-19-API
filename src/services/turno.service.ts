import HttpService from './http.service';
import IAgenda from '../interfaces/agenda.interface';
import IPaciente from '../interfaces/paciente.interface';
import ITipoPrestacion from '../interfaces/tipo-prestacion.interface';

export class TurnoService extends HttpService {
    protected baseUrl = 'modules/turnos/turno/agenda/';

    public async patch(agenda: IAgenda, paciente: IPaciente, tipoPrestacion: ITipoPrestacion, motivoConsulta = '', nota = '') {
        const res = await this._patch<IAgenda>(agenda.id, {
            paciente,
            tipoPrestacion,
            motivoConsulta,
            nota
        });
        return res;
    }
}

const turnoService = new TurnoService();
export default turnoService;
