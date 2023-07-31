const { URL } = require("../models/urlSchema");
const shortid = require("shortid");

async function handleCreateShortID(req, res) {
  const longURL = req.body;
  if (!longURL.url) {
    return res.status(400).json({ error: "Please give a URL" });
  }

  const shortId = shortid();
  await URL.create({
    shortID: shortId,
    redirectURL: longURL.url,
    ipAddress: req.socket.remoteAddress,
    visitedHistory: [],
    createdBy: req.user._id,
  });
  return res.render("home", { id: shortId });
  // return res.status(201).json({ msg: "URL shortened", id: shortId });
}

async function handleHomePageRender(req, res) {
  if (!req.user) return res.redirect("/login");
  const allUrls = await URL.find({ createdBy: req.user._id });
  return res.render("home", {
    urls: allUrls,
  });
}

async function handleGetRedirectURL(req, res) {
  const shortId = req.params.shortId;
  const longURL = await URL.findOneAndUpdate(
    {
      shortID: shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  return res.redirect(longURL.redirectURL);
}

async function handleUrlAnalytics(req, res) {
  const shortId = req.params.shortId;
  const url = await URL.findOne({ shortID: shortId });
  return res.status(200).json({
    totalClicks: url.visitHistory.length,
    analytics: url.visitHistory,
  });
}

module.exports = {
  handleCreateShortID,
  handleGetRedirectURL,
  handleUrlAnalytics,
  handleHomePageRender,
};
