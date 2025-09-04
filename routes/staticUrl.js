const express = require("express");
const router = express.Router();
const URL = require("../models/url");
const {getUser} = require("../services/auth");

router.get("/", async (req, res) => {
  const sessionId = req.cookies.uid;
  if (!sessionId) {
    return res.render("signin", {
      msg: "You need to sign in first!",
    });
  }
  const user = getUser(sessionId);
  if (!user) {
    return res.render("signin", {
      msg: "You need to sign in first!",
    });
  }

  const allUrls = await URL.find({createdBy: user._id});
  const shortId = req.query.id
//   console.log(shortId)

  return res.render("home", {
    urls: allUrls,
    name: user.name,
    id: shortId,
  });
});

router.get("/signup", (req, res) => {
  return res.status(200).render("signup");
});

router.get("/signin", (req, res) => {
  return res.render("signin");
});

module.exports = router;
