module.exports = (req, res, next) => {
    const { username, password } = req.headers;

    if (req.session && req.session.user) {
        next()
    }
    else {
        res.status(401).json({ message: "you are not supposed to be here!" })
    }
}