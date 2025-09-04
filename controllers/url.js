const URL = require("../models/url");
const {nanoid} = require("nanoid");
const {getUser} = require('../services/auth')

const handleGenerateShortURL = async (req, res) => {
  const {body} = req;
  try {
    const shortID = nanoid(7);
    console.log("ShortID created: ", shortID)

    const sessionId = req.cookies.uid
    if (!sessionId) {
        console.log("ERROR: No sessionId in cookie. Redirecting to signin.");
        return res.render('signin')
    }
    const user = getUser(sessionId)
    if (!user) {
        console.log("ERROR: No user found for this session ID. Redirecting to signin.");
        return res.render('signin')
    }
    console.log(user._id, req.user._id)

    await URL.create({
      shortId: shortID,
      redirectURL: body.url,
      visitHistory: [],
      createdBy: user._id
    });

    return res.redirect(`/?id=${shortID}`)

  } catch (error) {
    // Log the error for your own debugging
    console.error("Error creating short URL:", error); 
    
    // Render the home page with a generic error for the user
    return res.status(500).render("home", {
      error: "Something went wrong on our end. Please try again.",
    });
  }
};

const handleGetFromShortURL = async (req, res) => {
  const shortId = req.params.shortId;

  const url = await URL.findOneAndUpdate(
    {shortId},
    {
      "$push": {
        visitHistory: {
          timestamp: Date.now(),
        },
      }
    }
  );

  return res.redirect(url.redirectURL);
};

const handleShortUrlAnalytics = async (req, res) => {
  const shortId = req.params.shortId;

  const urlInfo = await URL.findOne({shortId});
  return res.status(200).json({
    totalClicks: urlInfo.visitHistory.length,
    analytics: urlInfo.visitHistory,
  });
};

const handleDeleteFromDB = async (req, res) => {
  const shortId = req.params.shortId;

  await URL.findOneAndDelete({shortId});
  return res.status(200).json({
    msg: `url with short ID ${shortId} deleted!`,
  });
};

module.exports = {
  handleGenerateShortURL,
  handleGetFromShortURL,
  handleShortUrlAnalytics,
  handleDeleteFromDB,
};
