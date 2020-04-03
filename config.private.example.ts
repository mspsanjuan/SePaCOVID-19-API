const configuration = {
    connections: {
        main: {
            url: 'mongodb://localhost:27017/sepacovid',
            options: {
                reconnectTries: Number.MAX_VALUE,
                reconnectInterval: 500,
            }
        }
    },
    ports: {
        main: 3001,
        websocket: 3002
    },
    jwt: {
        secret: 'debug'
    }
};

export default configuration;
