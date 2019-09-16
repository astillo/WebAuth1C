const express = require('express')
const server = express()
const bcrypt = require('bcrypt')
const restricted = require('./rest')

server.use(express.json())


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
                res.status(200).json({ message: `welcome ${username}` })
            } else {
                res.status(401).json({ message: 'you are not authenticated' })
            }
        })
        .catch(err => {
            res.status(500).json({ err })
        })
})

server.get('/users', restricted, (req, res) => {
    Users.find()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.status(500).json({ err })
        })
})


module.exports = server