const conn = require('../mairadb');
const { StatusCodes } = require('http-status-codes');

const order = (req, res) => {
  const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } = req.body;

  let deliveryId, orderId;

  let sql = 'INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)';
  let values = [delivery.address, delivery.receiver, delivery.contact];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    deliveryId = results.insertId;
    return res.status(StatusCodes.OK).json(results);
  });

  sql = 'INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)';
  values = [firstBookTitle, totalQuantity, totalPrice, userId, deliveryId];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    orderId = results.insertId;
    return res.status(StatusCodes.OK).json(results);
  });

  sql = 'INSERT INTO ordered_book (order_id, book_id, quantity) VALUES ?';
  values = [];
  items.forEach((item) => {
    values.push([orderId, item.bookId, item.quantity]);
  });
  conn.query(sql, [values], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

const getOrders = (req, res) => {};

const getOrderDetail = (req, res) => {};

module.exports = {
  order,
  getOrders,
  getOrderDetail,
};
