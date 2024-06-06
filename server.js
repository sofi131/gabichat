const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require("./config/database");
const routes = require('./routes/routes');
const protectedRoutes = require('./routes/protectedRoutes');
const socketController = require('./controllers/socketController');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
const session_middleware = (session({
  secret: 'supersecreto',
  store: new SequelizeStore({
    db: sequelize,
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}));
app.use(session_middleware);
app.use(routes);
app.use(protectedRoutes);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

(async () => {
  await sequelize.sync({/* force: true */});
})();

io.use((socket,next)=>{
  session_middleware(socket.request,socket.request.next||{},next);
});

socketController(io);

server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
