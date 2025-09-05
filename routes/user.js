const express = require("express");
const router = express.Router();
const {handleNewUserSignup} = require("../controllers/user");
const {handleUserSignin, handleUserLogout} = require("../controllers/user");

router.post("/signup", handleNewUserSignup);
router.post("/signin", handleUserSignin);
router.get("/signout", handleUserLogout);
router.get("/signin", (req, res) => {
    return res.render('signin')
});
router.get('/signup', (req, res) => {
    return res.render('signup')
})

module.exports = router;