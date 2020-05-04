import * as mongoose from 'mongoose';
import { CONNECTIONS } from '../config.private';

export class Connections {
    /**
     * Inicializa las conexiones necesarias a las base de datos
     */
    public initializeDataBase() {
        mongoose.plugin(schema => {
            schema.set('toJSON', {
                virtuals: true,
                versionKey: false
            });
        });
        mongoose.connect(CONNECTIONS.main.url, CONNECTIONS.main.options);
    }
}

const connections = new Connections();
export default connections;
