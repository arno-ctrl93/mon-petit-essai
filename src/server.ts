import http from 'http';
import { createHttpTerminator } from 'http-terminator';
import dotenv from 'dotenv';
import app from './app';

// Use .env file
dotenv.config();

// Function to normalize the port from env
const normalizePort = (val: string) => {
    const port = parseInt(val, 10);

    if (Number.isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

// Create port using env port or 3000 if null
const port = normalizePort(process.env.PORT || '3001');

// Set app port
app.set('port', port);

// Create http server
export const server = http.createServer(app);

// Create httpTerminator for graceful shutdown
export const httpTerminator = createHttpTerminator({
    server,
});


// Set lambda function while starting to listen
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? `pipe ${address}` : `port ${port}`;
    console.log(`Listening on ${bind}`);
});

// Start server
server.listen(port);