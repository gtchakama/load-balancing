# Node.js Load Balancing Example with Health Checks

This project demonstrates an implementation of load balancing in Node.js using the built-in `cluster` module, enhanced with health checks and automatic worker management. It creates a basic HTTP server and distributes incoming requests across multiple worker processes, effectively utilizing all available CPU cores while ensuring system resilience.

## Features

- Uses Node.js `cluster` module for load balancing
- Creates worker processes equal to the number of CPU cores
- Demonstrates even distribution of HTTP requests across workers
- Implements health checks for workers
- Automatically handles worker failures and restarts
- Simulates occasional worker crashes for demonstration purposes


## Installation

1. Clone this repository:

2. Navigate to the project directory:


## Usage

1. Run the server:
   ```
   node app.js
   ```
2. You should see console output indicating that the master process and worker processes have started.
3. Open a web browser or use a tool like curl to make requests to `http://localhost:8000`
4. Observe that responses come from different worker processes, demonstrating load balancing in action.
5. You may occasionally see messages about worker restarts due to simulated crashes or unresponsiveness.

## How it Works

The `cluster` module in Node.js allows easy creation of child processes that all share server ports. This example uses the following approach:

1. The master process creates a worker for each CPU core.
2. Each worker runs an HTTP server listening on port 8000.
3. When a request comes in, it's automatically distributed among the workers by the master process.
4. Each worker responds with a message that includes its process ID.
5. Workers send regular heartbeat messages to the master process.
6. The master process monitors worker health and restarts any unresponsive workers.
7. If a worker crashes, it is automatically replaced with a new worker.

### Health Checks and Worker Management

- Workers send a heartbeat message to the master every 5 seconds.
- The master checks worker health every 5 seconds.
- If a worker hasn't sent a heartbeat in 10 seconds, it's considered unresponsive and is restarted.
- Any worker that exits (crashes) is immediately replaced with a new worker.
- The example includes a simulation of occasional worker crashes (1% chance every 5 seconds) to demonstrate the restart mechanism.

## Limitations

- Use more robust load balancing solutions (e.g., Nginx, HAProxy)
- Implement more better health check mechanisms
- Use more advanced load balancing algorithms


