const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.JWT_SECRET_KEY;


const generate = (expiresIn, payload = {}) => {
  // 使用 secret 創建 JWT
  const token = jwt.sign(payload, jwtSecretKey, { algorithm: 'HS256', expiresIn });
  return token;
}

const verify = (token) => {
  return new Promise((rs, rj) => {
    jwt.verify(token, jwtSecretKey, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          console.log('Token has expired');
        } else {
          console.log('Token is invalid:', err.message);
        }
        return rs(false);
      } else {
        console.log('Decoded payload:', decoded);
        return rs(true);
      }
    });
  })
}


module.exports = {
  generate,
  verify
}
