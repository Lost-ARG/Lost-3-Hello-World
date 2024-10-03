const jwt = require("../service/jwtService")

const getToken = (req, res) => {
  const { expiresIn } = req.query;
  const token = jwt.generate(expiresIn);
  res.send({ status: 200, token });
}

const verifyToken = (req, res) => {
  const result = jwt.verify();
  res.send({ status: 200, result });
}


module.exports = {
  getToken,
  verifyToken
}
