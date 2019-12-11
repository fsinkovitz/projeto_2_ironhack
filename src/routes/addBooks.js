const express = require('express');
const router = express.Router();
const Book = require('../models/books.js');
const bodyParser = require('body-parser');
const uploadCloud = require('./cloundinary');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: false
}));

router.get('/addBooks', (req, res, next) => {
  res.render('addBooks');
});

router.post('/addBooks', uploadCloud.single('cover'), (req, res, next) => {
  console.log('test')
  const title = req.body.title;
  const gender = req.body.gender;
  const author = req.body.author;
  const coust = req.body.coust;
  const cover = req.file.url;
  const description = req.body.description;
  const company = req.body.publishCompany;

  Book.create({
      title,
      gender,
      author,
      coust,
      description,
      company,
      cover
    })
    .then((newBook) => {
      console.log(JSON.stringify(newBook));
      console.log('Book created');
      res.redirect('/listbooksSell');
    })
    .catch(error => {
      console.log(console.log('Error: ', error));
    });

})
module.exports = router;