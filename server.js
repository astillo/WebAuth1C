const express = require('express')
const server = express()
const bcrypt = require('bcrypt')
const restricted = require('./rest')
const restricted1 = require('./restrickedMiddleWare')
const session = require('express-session')
server.use(express.json())

const sessionConfig = {
    name: 'monkey',
    secret: 'keep it secret, keep it safe',
    cookie: {
        maxAge: 1000 * 30,
        secure: false, // this should be true in production
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
};

server.use(session(sessionConfig))

const Users = require('./userModel')

server.post('/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 8)
    Users.add(user, user.password = hash)
        .then(saved => {
            res.status(201).json(saved)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

server.post('/login', (req, res) => {
    let { username, password } = req.body;
    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.user = user
                res.status(200).json({ message: `welcome ${username}` })
            } else {
                res.status(401).json({ message: 'you are not authenticated' })
            }
        })
        .catch(err => {
            res.status(500).json({ err })
        })
})

server.get('/users', restricted1, (req, res) => {
    Users.find()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.status(500).json({ err })
        })
})


module.exports = server