const ensureAuthorization = require('../auth');
const conn = require('../mairadb');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const allBooks = (req, res) => {
  let allBooksRes = {};
  let { category_id, news, limit = 8, currentPage = 1 } = req.query;

  let sql =
    'SELECT SQL_CALC_FOUND_ROWS *, (SELECT count(*) FROM likes WHERE books.id=liked_book_id) AS likes FROM books';
  let offset = limit * (currentPage - 1);
  let values = [];

  if (category_id && news) {
    sql +=
      ' WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
    values.push(category_id);
  } else if (category_id) {
    sql += ' WHERE category_id = ?';
    values.push(category_id);
  } else if (news) {
    sql +=
      ' WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
  }

  sql += ' LIMIT ? OFFSET ?';
  values.push(parseInt(limit), offset);

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results.length) {
      results.map((result) => {
        result.pubDate = result.pub_date;
        delete result.pub_date;
      });
      allBooksRes.books = results;
    } else return res.status(StatusCodes.NOT_FOUND).end();
  });

  sql = 'SELECT found_rows()';
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    let pagination = {};
    pagination.currentPage = parseInt(currentPage);
    pagination.totalCount = results[0]['found_rows()'];

    allBooksRes.pagination = pagination;
    return res.status(StatusCodes.OK).json(allBooksRes);
  });
};

const bookDetail = (req, res) => {
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

  if (decodedJWT instanceof ReferenceError) {
    let bookId = req.params.id;

    let sql = `SELECT *, 
            (SELECT count(*) FROM likes WHERE books.id=liked_book_id) AS likes, 
            FROM books 
            LEFT JOIN categories ON books.category_id = categories.category_id WHERE id = ?`;
    conn.query(sql, bookId, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      if (results[0]) return res.status(StatusCodes.OK).json(results[0]);
      else return res.status(StatusCodes.NOT_FOUND).end();
    });
  }

  let bookId = req.params.id;

  let sql = `SELECT *, 
            (SELECT count(*) FROM likes WHERE books.id=liked_book_id) AS likes, 
            (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?)) AS liked 
            FROM books 
            LEFT JOIN categories ON books.category_id = categories.category_id WHERE id = ?`;
  conn.query(sql, [decodedJWT.id, bookId, bookId], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results[0]) return res.status(StatusCodes.OK).json(results[0]);
    else return res.status(StatusCodes.NOT_FOUND).end();
  });
};

module.exports = {
  allBooks,
  bookDetail,
};
