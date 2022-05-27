import { Server, Socket } from 'socket.io';
import http from 'http';

let emitSocketEvent: Socket;

const initializeSocket = (server: http.Server) => {

    const io = new Server(server);
    console.log('In initialize socket');
    return io.on('connection', (client: Socket) => {
        console.log('User Conected ===');

        client.on('disconnect', () => {
            console.log('User Disconnect');
        });

        emitSocketEvent = client;
    });
}

export { emitSocketEvent };

export default initializeSocket;