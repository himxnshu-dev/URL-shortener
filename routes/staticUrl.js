const express = require("express");
const router = express.Router();
const URL = require("../models/url");
const {getUser} = require("../services/auth");
const {name} = require("ejs");

router.get("/", async (req, res) => {
//   console.log("--- STATIC URL CHECKS ---");
  // verify checks and getting the user
  const token = req.cookies.uid;
//   console.log("Token received from browser:", token);
  if (!token) {
    console.log("No token found, redirecting to signup.");
    return res.render("signup");
  }
  const user = getUser(token);
//   console.log("User decoded from token:", user);
  if (!user) {
    console.log("Token invalid or expired, redirecting to signup.");
    return res.render("signup");
  }

  const allUserUrls = await URL.find({createdBy: user._id});
  const shortUrl = req.query.id;
//   console.log(user.name)

  return res.render("home", {
    urls: allUserUrls,
    id: shortUrl,
    name: user.name,
  });
});

router.get("/signup", (req, res) => {
  return res.status(200).render("signup");
});

router.get("/signin", (req, res) => {
  return res.render("signin");
});

module.exports = router;
