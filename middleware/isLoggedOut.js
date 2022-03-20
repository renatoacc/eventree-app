module.exports = (req, res, next) => {
  // checks user is logged out
  // redirects the user to the home page
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
};
