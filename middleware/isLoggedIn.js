module.exports = (req, res, next) => {
  // checks user is logged in
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  req.user = req.session.user;
  next();
};
