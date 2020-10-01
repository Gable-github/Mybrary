// Require this module only if in production and not deployment on heroku
// This module allows our server.js to read the .env file, which is not needed if using deployed version
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
};
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', (error) => console.error(error));
mongoose.connection.once('open', () => console.log('Connected to DB'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}));
app.use(methodOverride('_method'))

app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);
 
app.listen( process.env.PORT || 3000);