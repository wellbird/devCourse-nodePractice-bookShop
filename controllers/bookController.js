const conn = require('../mairadb');
const { StatusCodes } = require('http-status-codes');

const allBooks = (req, res) => {
  let { categoryId } = req.query;
  if (categoryId) {
    let sql = 'SELECT * FROM books WHERE category_id = ?';
    conn.query(sql, categoryId, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      if (results.length) return res.status(StatusCodes.OK).json(results);
      else return res.status(StatusCodes.NOT_FOUND).end();
    });
  } else {
    let sql = 'SELECT * FROM books';
    conn.query(sql, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      return res.status(StatusCodes.OK).json(results);
    });
  }
};

const bookDetail = (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  let sql = 'SELECT * FROM books WHERE id = ?';
  conn.query(sql, id, (err, results) => {
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