const conn = require('../mairadb');
const { StatusCodes } = require('http-status-codes');

const addToCart = (req, res) => {
  const { bookId, quantity, userId } = req.body;

  let sql = 'INSERT INTO cart_items (book_id, quantity, user_id) VALUES (?, ?, ?)';
  let values = [bookId, quantity, userId];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

const getCartItems = (req, res) => {
  const { user_id, selected } = req.body;
  let sql = `SELECT cart_items.id, book_id, title, summary, quantity, price
                  FROM cart_items LEFT JOIN books
                  ON cart_items.book_id = books.id
                  WHERE user_id=? AND cart_items.id IN (?)`;
  let values = [user_id, selected];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

const removeCartItem = (req, res) => {
  const { id } = req.params;
  let sql = 'DELETE FROM cart_items WHERE id=?';
  conn.query(sql, id, (err, results) => {
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
