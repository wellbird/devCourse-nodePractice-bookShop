const mariadb = require('mysql2/promise');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const ensureAuthorization = require('../auth');

const order = async (req, res) => {
  const conn = await mariadb.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'book_shop',
    dateStrings: true,
  });
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
  const { items, delivery, totalQuantity, totalPrice, firstBookTitle } =
    req.body;

  let sql =
    'INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)';
  let values = [delivery.address, delivery.receiver, delivery.contact];

  let [results] = await conn.execute(sql, values);

  let deliveryId = results.insertId;

  sql =
    'INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)';
  values = [
    firstBookTitle,
    totalQuantity,
    totalPrice,
    decodedJWT.id,
    deliveryId,
  ];
  [results] = await conn.execute(sql, values);

  let orderId = results.insertId;

  sql = `SELECT book_id, quantity FROM cart_items WHERE cart_items.id IN (?)`;
  let [orderItems, fields] = await conn.query(sql, [items]);

  sql = 'INSERT INTO ordered_book (order_id, book_id, quantity) VALUES ?';
  values = [];
  orderItems.forEach((item) => {
    values.push([orderId, item.book_id, item.quantity]);
  });
  results = await conn.query(sql, [values]);

  results = await deleteCartItems(conn, items);
  return res.status(StatusCodes.OK).json(results[0]);
};

const deleteCartItems = async (conn, items) => {
  let sql = `DELETE FROM cart_items WHERE id IN (?)`;

  let result = await conn.query(sql, [items]);
  return result;
};

const getOrders = async (req, res) => {
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

  const conn = await mariadb.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'book_shop',
    dateStrings: true,
  });

  let sql = `SELECT orders.id, created_at, address, receiver, contact, book_title, total_quantity, total_price
              FROM orders LEFT JOIN delivery
              ON orders.delivery_id = delivery.id;`;
  let [rows, fields] = await conn.query(sql);
  return res.status(StatusCodes.OK).json(rows);
};

const getOrderDetail = async (req, res) => {
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

  const orderId = req.params.id;
  const conn = await mariadb.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'book_shop',
    dateStrings: true,
  });
  let sql = `SELECT book_id, title, author, price, quantity
              FROM ordered_book LEFT JOIN books
              ON ordered_book.book_id = books.id
              WHERE order_id=?`;
  let [rows, fields] = await conn.query(sql, orderId);
  return res.status(StatusCodes.OK).json(rows);
};

module.exports = {
  order,
  getOrders,
  getOrderDetail,
};
