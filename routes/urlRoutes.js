const express = require("express");
const {
  handleCreateShortID,
  handleGetRedirectURL,
  handleUrlAnalytics,
  handleHomePageRender,
} = require("../controllers/shortController");

const router = express.Router();

router.route("/").post(handleCreateShortID);

router.route("/:shortId").get(handleGetRedirectURL);

router.route("/analytics/:shortId").get(handleUrlAnalytics);

module.exports = router;
