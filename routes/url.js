const express = require("express");
const {
  handleGenerateShortURL,
  handleGetFromShortURL,
  handleShortUrlAnalytics,
  handleDeleteFromDB
} = require("../controllers/url");
const router = express.Router();

router.post("/", handleGenerateShortURL);
router.route("/:shortId")
.get(handleGetFromShortURL)
.delete(handleDeleteFromDB)

// router.route('/:id')
// .delete(deleteUrlInfoFromDB)

router.get("/analytics/:shortId", handleShortUrlAnalytics);

module.exports = router;
