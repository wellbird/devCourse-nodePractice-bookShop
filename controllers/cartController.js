const jwt = require('jsonwebtoken');
const conn = require('../mairadb');
const { StatusCodes } = require('http-status-codes');
const ensureAuthorization = require('../auth');

const addToCart = (req, res) => {
  const { book_id, quantity } = req.body;

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

  let sql =
    'INSERT INTO cart_items (book_id, quantity, user_id) VALUES (?, ?, ?)';
  let values = [book_id, quantity, decodedJWT.id];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

const getCartItems = (req, res) => {
  const { selected } = req.body;

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

  let sql = `SELECT cart_items.id, book_id, title, summary, quantity, price
                  FROM cart_items LEFT JOIN books
                  ON cart_items.book_id = books.id
                  WHERE user_id=?`;
  let values = [decodedJWT.id];

  if (selected) {
    sql += ' AND cart_items.id IN (?)';
    values.push(selected);
  }
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

const removeCartItem = (req, res) => {
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

  const cartId = req.params.id;
  let sql = 'DELETE FROM cart_items WHERE id=?';
  conn.query(sql, cartId, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = {
  addToCart,
  getCartItems,
  removeCartItem,
};
