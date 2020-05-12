import fetch from 'node-fetch';
import { API_URL, API_TOKEN } from '../../config.private';

export interface IHttpResponse {
    code: number;
    text: string;
    data?: any;
}

export default abstract class HttpService {
    protected abstract baseUrl: string;

    protected async _get(route = '', params?: {[key: string]: string}): Promise<IHttpResponse> {
        const url = new URL(route, `${API_URL.ANDES}${this.baseUrl}`);
        if (params) {
            for (const key in params) {
                url.searchParams.append(key, params[key]);
            }
        }
        const res = await fetch(url.href, {
            method: 'get',
            headers: {
                'Authorization': API_TOKEN.ANDES,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        // Intentamos obtener la data en forma de JSON
        let resData;
        try {
            resData = await res.json();
        } catch (err) {
            // No pudo convertir a JSON lo devuelto
        }

        return {
            code: res.status,
            text: res.statusText,
            data: resData,
        };
    }

    protected async _post(route = '', body?: any): Promise<IHttpResponse> {
        const url = new URL(route, `${API_URL.ANDES}${this.baseUrl}`);
        const res = await fetch(url.href, {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Authorization': API_TOKEN.ANDES,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        // Intentamos obtener la data en forma de JSON
        let resData;
        try {
            resData = await res.json();
        } catch (err) {
            // No pudo convertir a JSON lo devuelto
        }

        return {
            code: res.status,
            text: res.statusText,
            data: resData,
        };
    }

    protected async _put(route = '', body?: any): Promise<IHttpResponse> {
        const url = new URL(route, `${API_URL.ANDES}${this.baseUrl}`);
        const res = await fetch(url.href, {
            method: 'put',
            body: JSON.stringify(body),
            headers: {
                'Authorization': API_TOKEN.ANDES,
                'Content-Type': 'application/json',
            },
        });
        // Intentamos obtener la data en forma de JSON
        let resData;
        try {
            resData = await res.json();
        } catch (err) {
            // No pudo convertir a JSON lo devuelto
        }

        return {
            code: res.status,
            text: res.statusText,
            data: resData,
        };
    }

    protected async _patch(route = '', body?: any): Promise<IHttpResponse> {
        const url = new URL(route, `${API_URL.ANDES}${this.baseUrl}`);
        const res = await fetch(url.href, {
            method: 'patch',
            body: JSON.stringify(body),
            headers: {
                'Authorization': API_TOKEN.ANDES,
                'Content-Type': 'application/json',
            },
        });
        // Intentamos obtener la data en forma de JSON
        let resData;
        try {
            resData = await res.json();
        } catch (err) {
            // No pudo convertir a JSON lo devuelto
        }

        return {
            code: res.status,
            text: res.statusText,
            data: resData,
        };
    }
}
