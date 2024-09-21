const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  const workers = {};

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    forkWorker();
  }

  function forkWorker() {
    const worker = cluster.fork();
    workers[worker.id] = { process: worker, lastHeartbeat: Date.now() };

    // Setup message handler for worker
    worker.on('message', (msg) => {
      if (msg.type === 'heartbeat') {
        workers[worker.id].lastHeartbeat = Date.now();
      }
    });
  }

  // Perform health checks every 5 seconds
  setInterval(() => {
    const now = Date.now();
    for (const id in workers) {
      if (now - workers[id].lastHeartbeat > 10000) { // 10 seconds threshold
        console.log(`Worker ${id} is unresponsive. Restarting...`);
        workers[id].process.kill('SIGTERM');
        delete workers[id];
        forkWorker();
      }
    }
  }, 5000);

  // Handle worker exits
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    delete workers[worker.id];
    forkWorker();
  });

} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Hello from Worker ${process.pid}\n`);
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);

  // Send heartbeat every 5 seconds
  setInterval(() => {
    process.send({ type: 'heartbeat' });
  }, 5000);

  // Simulate occasional crashes
  if (Math.random() < 0.01) { // 1% chance of crash every heartbeat interval
    throw new Error('Simulated worker crash');
  }
}
