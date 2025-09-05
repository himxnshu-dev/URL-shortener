const {getUser} = require('../services/auth')

async function restrictToLoggedIn(req, res ,next) {
    // console.log("--- AUTH MIDDLEWARE ---");
    const token = req.cookies.uid;
    // console.log("Token received from browser:", token);
    if (!token) {
        console.log("No token found, redirecting to signin.");
        return res.redirect('/signin')
    }

    const user = getUser(token)
    console.log("User decoded from token:", user);
    if (!user) {
        console.log("Token invalid or expired, redirecting to signup.");
        return res.redirect('/signin')
    }

    req.user = user;
    next()
}

module.exports = {restrictToLoggedIn}