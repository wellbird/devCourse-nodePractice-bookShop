const conn = require('../mairadb');
const { StatusCodes } = require('http-status-codes');

const allBooks = (req, res) => {
  let { categoryId, newBook, limit, curPage } = req.query;

  let sql = 'SELECT *, (SELECT count(*) FROM likes WHERE books.id=liked_book_id) AS likes FROM books';
  let offset = limit * (curPage - 1);
  let values = [];

  if (categoryId && newBook) {
    sql += ' WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
    values.push(categoryId);
  } else if (categoryId) {
    sql += ' WHERE category_id = ?';
    values.push(categoryId);
  } else if (newBook) {
    sql += ' WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
  }

  sql += ' LIMIT ? OFFSET ?';
  values.push(parseInt(limit), offset);

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results.length) return res.status(StatusCodes.OK).json(results);
    else return res.status(StatusCodes.NOT_FOUND).end();
  });
};

const bookDetail = (req, res) => {
  let bookId = req.params.id;
  let { userId } = req.body;
  id = parseInt(id);
  let sql = `SELECT *, 
            (SELECT count(*) FROM likes WHERE books.id=liked_book_id) AS likes, 
            (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?)) AS liked 
            FROM books 
            LEFT JOIN category ON books.category_id = category.category_id WHERE id = ?`;
  conn.query(sql, [userId, bookId, bookId], (err, results) => {
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
