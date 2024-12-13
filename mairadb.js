const mariadb = require('mysql2');

const connection = mariadb.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'book_shop',
  dateStrings: true,
});

module.exports = connection;
