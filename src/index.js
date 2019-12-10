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


// **********  A D D   --- B O O K S  ***********//

app.get('/addBooks', (request, response) => {
  const { user } = request.session;
  response.render('addBooks', { user });
});

app.post('/addBooks', (request, response, next) => {
  const { user } = request.session;
  const title = request.body.title;
  const gender = request.body.gender;
  const author = request.body.author;
  const price = request.body.price;
  const description = request.body.description;
  const cover = request.body.cover;
  const publishCompany = request.body.publishCompany;

  // if (title === '' || gender === '' || author === "" || price === "" || description === "" || cover === "" || publishCompany === "") {
  //   response.render('addBooks', {
  //     errorMessage: 'Please, indicate all informations to add the book',
  //   });
  //   return;
  // }

  // Book.findOne({ 'title': title, 'author': author })
  //   .then(book => {
  //     if (book.title !== null) {
  //       response.render('addBooks', {
  //         errorMessage: 'The title already exists!',
  //       });
  //       return;
  //     }
  //   })
  //   .catch(error => {
  //     next(error);
  //   });

  Book.create({ title: title, gender: gender, author: author, price: price, description: description, cover: cover, publishCompany: publishCompany })
    .then((newBook) => {
      console.log('New book infos ' + newBook)
      response.render('addBookMessage', { newBook, user });
    })
    .catch(error => {
      console.log(console.log('An error happened: ', error));
    });
});
// **********  E N D  --  A D D   --- B O O K S  ***********//


// ********** E D I T --  B O O K S  ***********//
app.get('/editbooks', (request, response, next) => {
  const { user } = request.session;
  const id = '5def013c57296f46005e3d5c';
  Book.findOne({ '_id': id })
    .then(bookDetails => {
      response.render('editbooks', { book: bookDetails, user });
    })
    .catch(error => {
      next(error);
    });
});

app.post('/editbooks', (request, response, next) => {
  const { user } = request.session;
  const id = '5def013c57296f46005e3d5c';
  const title = request.body.title;
  const gender = request.body.gender;
  const author = request.body.author;
  const price = request.body.price;
  const description = request.body.description;
  const cover = request.body.cover;
  const publishCompany = request.body.publishCompany;

  Book.findOneAndUpdate({ _id: id }, { title: title, gender: gender, author: author, price: price, description: description, cover: cover, publishCompany: publishCompany })
    .then((editedBook) => {
      response.render('editbooks', { book: editedBook, user });
    })
    .catch(error => {
      console.log(console.log('An error happened: ', error));
    });
});
// **********  E N D  --  E D I T --  B O O K S  ***********//








// ********** P R O F I L E ***********//

app.get('/profile', (request, response) => {
  const { user } = request.session;
  response.render('profile', { user });
});

app.post('/profile', (request, response, next) => {
  const username = request.body.username
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
  //console.log(request.body);
  const title = 'Livro titulo';

  Book.findOne({ 'title': title })
    .then(bookDetails => {
      //  console.log(bookDetails);
      response.render('socialbooks', { book: bookDetails, user });
    })
    .catch(error => {
      next(error);
    });
});

// ********** E N D -  B O O K  -  D E T A I L S ***********//




app.get('/listbooksBuy', (request, response) => {
  const { user } = request.session;
  Book.find()
    .then(bookFromDB => {
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
