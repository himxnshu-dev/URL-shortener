const {getUser} = require("../services/auth");

const authenticationCheck = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return next();

  const user = getUser(token);
  req.user = user;

  next();
};

const restrictTo = (roles = []) => {
  return function (req, res, next) {
    if (!req.user) return res.redirect("/signin");
    if (!roles.includes(req.user.role)) return res.end("UNAUTHORIZED!");
    next();
  };
};

module.exports = {authenticationCheck, restrictTo};
