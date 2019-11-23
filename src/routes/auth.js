const express = require('express');
const router = express.Router();
const User = require('../Models/user.js');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));
const bcrypt = require('bcryptjs');
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === '' || password === '') {
    res.render('auth/signup', {
      errorMessage: 'Indicate a username and a password to sign up',
    });
    return;
  }

  User.findOne({'username': username})
      .then(user => {
        if (user !== null) {
          res.render('auth/signup', {
            errorMessage: 'The username already exists!',
          });
          return;
        }
      })
      .catch(error => {
        next(error);
      });

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);


  User.create({username, password: hashPass})
      .then(() => {
        console.log('User created. ' + username + ' pass: ' + hashPass);
        res.redirect('/');
      })
      .catch(error => {
        console.log(console.log('An error happened: ', error));
      });
});







router.post('/login', (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === '' || thePassword === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, username and password to sign up.',
    });
    return;
  }

  User.findOne({'username': theUsername})
      .then(user => {
        if (!user) {
          res.render('auth/login', {
            errorMessage: `The username doesn't exist.`,
          });
          return;
        }
        if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
          req.session = user;
          res.redirect('/');
        } else {
          res.render('auth/login', {
            errorMessage: 'Incorrect password',
          });
        }
      })
      .catch(error => {
        next(error);
      });
});

module.exports = router;
