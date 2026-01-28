require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const itemsRouter = require('./routes/items');
const setupBidHandlers = require('./socket/bidHandler');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));
app.use(express.json());

app.use('/api', itemsRouter);

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        serverTime: new Date().toISOString()
    });
});

app.get('/api/server-time', (req, res) => {
    res.json({
        serverTime: new Date().toISOString()
    });
});

setupBidHandlers(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`\n Live Bidding Server Running`);
    console.log(` HTTP Server: http://localhost:${PORT}`);
    console.log(` WebSocket Server: ws://localhost:${PORT}`);
    console.log(` Server Time: ${new Date().toISOString()}\n`);
});
