const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3000;

// 🔵 Inicializar express
const app = express();

// 🔵 Crear servidor HTTP
const server = http.createServer(app);

// 🔵 Inicializar Socket.io
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// 🔵 Middlewares
app.use(cors());
app.use(express.json());

// 🔵 Tus rutas API completas
const authRoutes = require('./routes/authRoutes');
const salaRoutes = require('./routes/salaRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api', authRoutes);
app.use('/api', salaRoutes);
app.use('/api', userRoutes);

// 🔵 Configuración de Socket.io
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);

    socket.on('joinSala', (salaId) => {
        socket.join(salaId);
        console.log(`Cliente ${socket.id} se unió a sala ${salaId}`);
    });

    socket.on('updateContenido', ({ salaId, contenido }) => {
        console.log(`Recibí contenido para la sala ${salaId}`);
        io.to(salaId).emit('recibirContenido', contenido); // 👈 io.to(), no socket.to()
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

// 🔵 Levantar servidor
server.listen(PORT, () => {
    console.log('Servidor corriendo en puerto', PORT);
});
