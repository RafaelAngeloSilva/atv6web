const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


const app = express();
const PORT = 3000;

// Middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'seu_segredo_aqui', // Altere para um segredo seguro
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Altere para true se estiver usando HTTPS
}));

// Rota inicial
app.get('/', (req, res) => {
    res.send('<h1>Bem-vindo ao sistema de autenticação</h1><a href="/login">Login</a> <a href="/protected">Área Protegida</a>');
});

// Rota de login
app.get('/login', (req, res) => {
    res.send(`
        <form method="POST" action="/login">
            <input type="text" name="username" placeholder="Username" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
    `);
});

// Rota de logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

// Simulação de um banco de dados de usuários
const users = {
    user1: 'password1', // username: password
    user2: 'password2'
};

// Rota de login (POST)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
        req.session.username = username; // Armazena o username na sessão
        return res.redirect('/protected');
    }
    res.send('Usuário ou senha inválidos. <a href="/login">Tente novamente</a>');
});

// Middleware de autenticação
const isAuthenticated = (req, res, next) => {
    if (req.session.username) {
        return next();
    }
    res.redirect('/login');
};

// Rota protegida
app.get('/protected', isAuthenticated, (req, res) => {
    res.send(`<h1>Área Protegida</h1><p>Bem-vindo, ${req.session.username}!</p><a href="/logout">Logout</a>`);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});