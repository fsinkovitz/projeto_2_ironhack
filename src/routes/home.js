
const express = require('express');
const router = express.Router();
const Book = require('../models/books');

router.get(['/', '/home'], (request, response) => {
  console.log(request);
  Book.find()
    .then(bookFromDB => {
      console.log('Retrieved books from DB:', bookFromDB);
      response.render('index', { books: bookFromDB });
  })
  .catch(error => {
    console.log('Error: ', err);
  })
});

module.exports = router;