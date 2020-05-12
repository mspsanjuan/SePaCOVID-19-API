import HttpService from './http.service';
import IAgenda from '../interfaces/agenda.interface';
import IPaciente from '../interfaces/paciente.interface';
import ITipoPrestacion from '../interfaces/tipo-prestacion.interface';

export interface IGetTurnoResponse {
    code: number;
    text: string;
    data?: IAgenda[];
}

export interface IPostTurnoResponse {
    code: number;
    text: string;
    data?: IAgenda;
}

export class TurnoService extends HttpService {
    protected baseUrl = 'modules/turnos/turno/agenda/';

    // public async get(fechaDesde: Date, fechaHasta: Date, idProfesional: string): Promise<IGetTurnoResponse> {
    //     const res: IGetTurnoResponse = await this._get('', {
    //         fechaDesde: fechaDesde.toString(),
    //         fechaHasta: fechaHasta.toString(),
    //         idProfesional,
    //     });
    //     return res;
    // }

    // public async post(agenda: IAgenda) {
    //     const res: IPostTurnoResponse = await this._post('', agenda);
    //     return res;
    // }

    public async patch(agenda: IAgenda, paciente: IPaciente, tipoPrestacion: ITipoPrestacion, motivoConsulta = '', nota = '') {
        const res: IPostTurnoResponse = await this._patch(agenda.id, {
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
