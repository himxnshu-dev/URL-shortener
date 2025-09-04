const express = require("express");
const router = express.Router();
const URL = require("../models/url");

router.get("/", async (req, res) => {
  
  return res.render("signup");
});

router.get('/signup', (req, res) => {
    return res.status(200).render('signup')
})

router.get('/signin', (req, res) => {
    return res.render('signin')
})

router.get('/url', async (req, res) => {
    if (!req.session.userId) {
        return res.render('signup')
    }
    const allUrls = await URL.find({createdBy: req.session.userId});
    const shortID = req.query.id
    return res.render('home', {
    urls: allUrls,
    id: shortID
  })
})

module.exports = router;
