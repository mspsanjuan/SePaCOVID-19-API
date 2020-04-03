import * as mongoose from 'mongoose';
import configuration from '../config.private';

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
        mongoose.connect(configuration.connections.main.url, configuration.connections.main.options);
    }
}

const connections = new Connections();
export default connections;
