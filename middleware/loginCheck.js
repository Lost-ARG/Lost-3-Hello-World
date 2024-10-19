const adminLoginCheck = (req, res, next) => {
  if(req.session.admin === undefined) {
    res.redirect("/backstage/login");
    return;
  }
  next();
}

module.exports = {
  adminLoginCheck,
}
