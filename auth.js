const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const ensureAuthorization = (req, res) => {
  try {
    const receivedJWT = req.headers.authorization;
    if (receivedJWT) {
      let decodedJWT = jwt.verify(receivedJWT, process.env.PRIVATE_KEY);
      return decodedJWT;
    }
    throw new ReferenceError('jwt must be provided');
  } catch (err) {
    console.log(err.name);
    console.log(err.message);

    return err;
  }
};

module.exports = ensureAuthorization;
