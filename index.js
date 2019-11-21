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
    //console.log(request);
    response.render('home');
  });

app.listen(3000, () => {
  console.log('Rodando o projeto')
});  