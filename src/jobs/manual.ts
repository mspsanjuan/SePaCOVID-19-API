import * as path from 'path';

// Connections.initialize();

const done = () => {
    process.exit(0);
};

const actionName = process.argv[2];
const action = require(path.join('..', actionName));

action(done);
