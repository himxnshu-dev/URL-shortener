const express = require("express");
const router = express.Router();
const URL = require("../models/url");

router.get("/", async (req, res) => {
  const allDbUsers = await URL.find({});
  return res.render("home", {
    urls: allDbUsers,
  });
});

router.get('/signup', (req, res) => {
    return res.status(200).render('signup')
})

module.exports = router;
