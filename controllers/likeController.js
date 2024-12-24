const jwt = require('jsonwebtoken');
const conn = require('../mairadb');
const { StatusCodes } = require('http-status-codes');
const ensureAuthorization = require('../auth');

const addLike = (req, res) => {
  const bookId = req.params.id;

  const decodedJWT = ensureAuthorization(req, res);

  if (decodedJWT instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '로그인 세션이 만료되었습니다.',
    });
  }

  if (decodedJWT instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: '잘못된 토큰입니다.',
    });
  }

  let sql = 'INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)';
  let values = [decodedJWT.id, bookId];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

const removeLike = (req, res) => {
  const bookId = req.params.id;

  const decodedJWT = ensureAuthorization(req, res);

  if (decodedJWT instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '로그인 세션이 만료되었습니다.',
    });
  }

  if (decodedJWT instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: '잘못된 토큰입니다.',
    });
  }

  let sql = 'DELETE FROM likes WHERE user_id=? AND liked_book_id=?';
  let values = [decodedJWT.id, bookId];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = {
  addLike,
  removeLike,
};
