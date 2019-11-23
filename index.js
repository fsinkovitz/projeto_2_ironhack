require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
const axios = require('axios').default;

//const mongo_url = process.env.MONGO_URL;

app.set('view engine', 'hbs');
app.set('views', __dirname + '/src/views');
app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://localhost/Feature-home-page', {useNewUrlParser: true})
  .then(() => {
    console.log('Conexão realizada com sucesso!');
  }).catch(err => {
    console.error('Erro de conexão', err);
  });

  app.get(['/', '/home'], (request, response) => {
    console.log(request);
    response.render('index');
  });

  app.get('/details', (request, response) => {
    console.log(request);
    response.render('details');
  });

  app.get('/login', (request, response) => {
    console.log(request);
    response.render('login');
  });

  app.get('/signup', (request, response) => {
    console.log(request);
    response.render('signup');
  });

  app.get('/listbooks', (request, response) => {
    console.log(request);
    response.render('lisbooks');
  });

  app.get('/socialbooks', (request, response) => {
    console.log(request);
    response.render('social_books');
  });

  app.get('/editbooks', (request, response) => {
    console.log(request);
    response.render('edit_add_books');
  });

  app.get('/buybooks', (request, response) => {
    console.log(request);
    response.render('buy_books');
  });

app.listen(3000, () => {
  console.log('Rodando o projeto');
});