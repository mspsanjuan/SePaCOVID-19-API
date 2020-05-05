import HttpService from './http.service';
import IProfesional from '../interfaces/profesional.interface';

export interface IProfesionalResponse {
    code: number;
    text: string;
    data?: IProfesional[];
}

export class ProfesionalService extends HttpService {
    protected baseUrl = 'core/tm/profesionales';

    public async get(params): Promise<IProfesionalResponse> {
        const res: IProfesionalResponse = await this._get('', params);
        return res;
    }
}
const profesionalService = new ProfesionalService();
export default profesionalService;
