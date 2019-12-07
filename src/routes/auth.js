const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
const bcrypt = require('bcryptjs');
const bcryptSalt = 10;
const nodemailer = require('nodemailer');

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

//Signup
router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const email = req.body.email;
  const profile = req.body.profile;
  //const message = req.body.message;

  if (username === '' || password === '' || email === "") {
    res.render('auth/signup', {
      errorMessage: 'Indicate a user name, email, profile and a password to sign up',
    });
    return;
  }
  if (password !== confirmPassword) {
    res.render('auth/signup', {
      errorMessage: 'The password and confirmation are not the same',
    });
    return;
  }

  User.findOne({ 'userName': username, 'email': email })
    .then(user => {
      if (user.userName !== null) {
        res.render('auth/signup', {
          errorMessage: 'The username already exists!',
        });
        return;
      }
      else if (user.email !== null) {
        res.render('auth/signup', {
          errorMessage: 'The email already exists in other account!',
        });
        return;
      }
    })
    .catch(error => {
      next(error);
    });

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.create({ userName: username, email, password: hashPass, profile })
    .then((newUser) => {
      res.redirect('/');
    })
    .catch(error => {
      console.log(console.log('An error happened: ', error));
    });

  //send mail
  let subject = 'Iron Books registration confirmation';
  let message = `Please confirm your registration by clicking this link
  XXXXXXXXXXXXXXXXXSSSSSSSSSZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ`;
  res.render('message', { email })

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'ironbooksproject@gmail.com',
      pass: 'Ironbooks19@'
    }
  });
  transporter.sendMail({
    from: '"Iron Books Project 👻" <ironbooksproject@gmail.com>',
    to: email + ',ironbooksproject@gmail.com',
    subject: subject,
    text: '',
    html: `<b>${message}</b>`
  })
    .then(info => res.render('message', { email, subject, message, info }))
    .catch(error => console.log(error));
});

//Login
router.post('/login', (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === '' || thePassword === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, username and password to sign up.',
    });
    return;
  }

  User.findOne({ 'userName': theUsername })
    .then(user => {
      if (!user) {
        res.render('auth/login', {
          errorMessage: `The username doesn't exist.`,
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session! 
        req.session.user = user;

        if (user.profile === '1') {
          res.redirect('/listbooksSell');
        }
        else {
          res.redirect('/listbooksBuy');
        }

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