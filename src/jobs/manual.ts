import * as path from 'path';
// import connections from '../connections';
import jobs from '../jobs';

const done = () => {
    process.exit(0);
};

const run = async () => {
    const jobName = process.argv[2];
    if (!jobName) {
        // tslint:disable-next-line: no-console
        console.error('\x1b[31mDebe colocar el nombre del job a ejecutar\x1b[0m');
        done();
    }
    if (!jobs[jobName]) {
        // tslint:disable-next-line: no-console
        console.error(`\x1b[31mEl Job "${jobName}" no se encuentra registrado\x1b[0m`);
        done();
    }
    // tslint:disable-next-line: no-console
    console.log(`\x1b[44m=> Ejecutando Job ${jobName}\x1b[0m`);
    // Inicializamos la base de datos
    // connections.initializeDataBase();
    // Ejecutamos el job
    await jobs[jobName]();
    done();
};

// Run Job
run();
