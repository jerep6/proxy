const os = require('os'),
    cluster = require('cluster'),
    app = require('./app');

const port = process.argv[2] || 3000;

// Use cluster module to start a node instance on each cpu
const count = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Start in cluster mode with %s instances `);
    for (let i = 0; i < count; i++) {
        cluster.fork();
    }
    //I saw lot of best practice using 'exit', need to talk about it
    cluster.on('exit', worker => {
        console.log(`worker ${worker.pid} died. spawning a new process...`);
        cluster.fork();
    });

    console.log(`Starting application on port ${port} with ${count} workers`);
} else {
    app.listen(port);
    console.log(`Starting application on port ${port}`);
}

process.on('uncaughtException', err => {
    console.log("uncaughtException", err);
    process.exit(1)
});

