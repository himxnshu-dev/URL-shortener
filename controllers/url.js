const URL = require("../models/url");
const {nanoid} = require("nanoid");
const express = require("express");

const handleGenerateShortURL = async (req, res) => {
  const {body} = req;
  const shortID = nanoid(7);

  if (!body.url) {
    return res.status(400).json({
      msg: "A valid URL is required!",
    });
  }

  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
  });

  return res.status(201).render("home", {
    id: shortID,
  });
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
      },
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
