const bcrypt = require('bcrypt')

const Users = require('./userModel')

module.exports = (req, res, next) => {
    let { username, password } = req.headers

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                next()
            }
            else {
                res.status(401).json({ message: 'You should not be here, cover your eyes!' })
            }
        })
        .catch(err => {
            res.status(500).json({ err })
        })
}

function fetch() {
    const reqOptions = {
        headers: {
            username: '',
            password: '',
        },
    }
}