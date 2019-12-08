require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const router = require('./routes/auth.js');
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '../../public'));
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const hbs = require('hbs');
const axios = require('axios').default;
const Book = require('../src/models/books');
const User = require('./models/user');

mongoose.connect('mongodb+srv://jesus:F4iC0I35R5snjcIs@cluster0-3dz7l.azure.mongodb.net/ironbook-users?retryWrites=true&w=majority', { useNewUrlParser: true })
  //mongoose.connect('mongodb://heroku_b6z2mw6l:1djmt1m9tm8sm1kr2hvabeco79@ds351628.mlab.com:51628/heroku_b6z2mw6l', { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to Mongo!');
  })
  .catch(err => {
    console.error('Error connecting to mongo', err);
  });

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '../../public'));

app.use(session({
  secret: 'ironbook-auth-secret',
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60, // 1 day
  }),
}));

app.use(router);

// app.use('/login', require('./routes/auth-routes'));
app.use(['/', '/home'], require('./routes/home'));

app.get('/listbooksSell', (request, response) => {
  const { user } = request.session;
  // console.log(request.session);
  Book.find()
    .then(bookFromDB => {
      // console.log('Retrieved books from DB:', bookFromDB);
      response.render('listbooksSell', { books: bookFromDB, user });
    })
    .catch(error => {
      console.log('Error: ', err);
    })
});


// router.get('/buybooks', (request, response) => {
//   console.log(request);
//   response.render('buy_books');
// });

// router.get(['/', '/home'], (request, response) => {
//  // console.log(request);
//   Book.find()
//     .then(bookFromDB => {
//       console.log('Retrieved books from DB:', bookFromDB);
//       response.render('index', { books: bookFromDB });
//     })
//     .catch(error => {
//       console.log('Error: ', err);
//     })
// });


// colcoar Id para trazer dados apenas do livro escolhido
// router.get('/details', (request, response) => {
//   // console.log(request);
//   Book.find()
//     .then(bookFromDB => {
//      // console.log('Retrieved books from DB:', bookFromDB);
//       response.render('details', { books: bookFromDB });
//     })
//     .catch(error => {
//       console.log('Error: ', err);
//     })
// });






app.get('/addBooks', (request, response) => {
  const { user } = request.session;
  response.render('addBooks', { user });
});


// ********** P R O F I L E ***********//

app.get('/profile', (request, response) => {
  const { user } = request.session;
  response.render('profile', { user });
});

app.post('/profile', (request, response, next) => {
  const username = request.body.username
  console.log('passou ' + user);
  User.findOne({ 'userName': username })
    .then(user => {
      console.log('validou usuario    ');
      // if (user.userName === null) {
      //   response.render('/profile', {
      //     errorMessage: 'The username not exists!',
      //   });
      //   return;
      // }
      // else {
      //   response.render('profile', { user });
      // }
    })
    .catch(error => {
      next(error);
    });
});




// ********** E N D  -  P R O F I L E ***********//



// ********** B O O K  -  D E T A I L S ***********//
app.get('/socialbooks', (request, response) => {
  const { user } = request.session;
  response.render('socialbooks', { user });
});


app.post('/socialbooks', (request, response, next) => {
  //const bookId = request.body.bookId;
  console.log(request.body);

  Book.findOne({ slug: "eloquent-javascript" })
    .then(bookFromDB => {
     // console.log(bookFromDB);
      response.render('socialbooks', { book: bookFromDB, user });
    })
    .catch(error => {
      next(error);
    });
});



// ********** E N D -  B O O K  -  D E T A I L S ***********//




app.get('/editbooks', (request, response) => {
  const { user } = request.session;
  // console.log(request);
  response.render('editbooks', { user });
});

app.get('/listbooksBuy', (request, response) => {
  const { user } = request.session;
  Book.find()
    .then(bookFromDB => {
      // console.log('Retrieved books from DB:', bookFromDB);
      response.render('listbooksBuy', { books: bookFromDB, user });
    })
    .catch(error => {
      console.log('Error: ', err);
    })
});

app.get('/payment', (request, response) => {
  const { user } = request.session;
  // console.log(request);
  response.render('payment', { user });
});


app.listen(3000, () => console.log('Listen'));
