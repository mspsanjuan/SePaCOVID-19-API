import HttpService from './http.service';
import IProfesional from '../interfaces/profesional.interface';

export class ProfesionalService extends HttpService {
    protected baseUrl = 'core/tm/profesionales';

    public async get(params) {
        const res = await this._get<IProfesional[]>('', params);
        return res;
    }
}
const profesionalService = new ProfesionalService();
export default profesionalService;
