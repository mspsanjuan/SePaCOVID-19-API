export const JWT = '';

export const API_URL = {
    ANDES: 'http://127.0.0.1:3002/api/'
};

export const API_TOKEN = {
    ANDES: ''
};

export const CONNECTIONS = {
    main: {
        url: 'mongodb://localhost:27017/sepacovid',
        options: {
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 500,
        }
    }
};

export const PORTS = {
    main: 3001,
    websocket: 3002
};
