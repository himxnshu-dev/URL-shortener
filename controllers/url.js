const URL = require("../models/url");
const {nanoid} = require("nanoid");
const express = require("express");

const handleGenerateShortURL = async (req, res) => {
  const {body} = req;
  try {
    const shortID = nanoid(7);

    if (!req.session.userId) {
        return res.render('signin')
    }

    await URL.create({
      shortId: shortID,
      redirectURL: body.url,
      visitHistory: [],
      createdBy: req.session.userId
    });

    // 3. On success, render the page (no need for .status(201))
    // return res.render("home", {
    //   id: shortID,
    //   urls: allUrls
    // });

    return res.redirect(`/url?id=${shortID}`)

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
