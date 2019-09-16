const express = require('express')
const server = express()
const bcrypt = require('bcrypt')
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
module.exports = server