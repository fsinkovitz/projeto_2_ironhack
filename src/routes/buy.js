const express = require('express');
const booksSell = express.Router();
const Book = require('../models/books');

booksSell.get('/listbooksBuy', (request, response) => {
  Book.find()
    .then(bookFromDB => {
     // console.log('Retrieved books from DB:', bookFromDB);
      response.render('listbooksBuy', { books: bookFromDB });
    })
    .catch(error => {
      console.log('Error: ', err);
    })
});

module.exports = booksBuy;