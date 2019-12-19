const express = require('express');
const router = express.Router();
const Book = require('../models/books');

router.get(['/', '/home'], (request, response) => {
  const { user } = request.session;
  if (user === undefined) {
    response.render('./auth/login');
  }
  else {

    Book.find()
      .then(bookFromDB => {
        //   console.log('Retrieved books from DB:', bookFromDB);
        response.render('index', { books: bookFromDB, user });
      })
      .catch(error => {
        console.log('Error: ', error);
      });
  }
});


module.exports = router;
