const express = require("express");
const router = express.Router();
const URL = require("../models/url");
const {getUser} = require("../services/auth");
const { restrictTo } = require("../middlewares/auth");

router.get("/", restrictTo(['NORMAL']), async (req, res) => {
  const allUserUrls = await URL.find({createdBy: req.user._id});
  const shortUrl = req.query.id;
//   console.log(user.name)

  return res.render("home", {
    urls: allUserUrls,
    id: shortUrl,
    name: req.user.name,
    role: req.user.role
  });
});

router.get("/signup", (req, res) => {
  return res.status(200).render("signup");
});

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get('/admin/url', restrictTo(['ADMIN']), async(req, res) => {
    const allUrls = await URL.find({})
    return res.render('home', {
        urls: allUrls,
    })
})

module.exports = router;
