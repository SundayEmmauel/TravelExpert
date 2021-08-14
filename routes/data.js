// var serverOne = process.env.DATA_URL || "http://localhost:8050/";
var serverOne = process.env.DATA_URL || "http://127.0.0.1:8050/" || "https://datafile1.azurewebsites.net/";

module.exports = function (req, res) {
  if (!req.user || req.user.role != "manager") {
    req.session.msg = "You are not allowed to acces the business data.";
    res.status(403).redirect("/");
  }
  // Use this variable to send paramters to the Python data project through the URL
  var urlParams = "Greece/545";
  res.render("data", { serverOne: serverOne + urlParams });
};
