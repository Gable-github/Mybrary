const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
//require the index file
const indexRouter = require('./routes/index')
const router = require('./routes');
require('dotenv').config();

//open connection to database on locally running instance on mongodb
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true });
//check and catch any connection error to DB
mongoose.connection.on('error', (error) => console.error(error));
mongoose.connection.once('open', () => console.log('Connected to DB'));

//set our view engine
app.set('view engine', 'ejs');
//set where (which folder) our views are coming from 
app.set('views', __dirname + '/views');
//lastly, hook up express layouts
//This express-ejs-layouts allows you to duplicate the header and footer section
//of your website.
//app.set(NAME, LOCATION)
app.set('layout', 'layouts/layout');
//Use the expressLayouts middleware/module located in layouts/layout
app.use(expressLayouts);
app.use(express.static('public'));

//use indexRouter to handle incoming get requests at '/'
//since indexRouter is a middleware, use app.use instead of app.get
app.use('/', indexRouter);

app.listen( process.env.PORT || 3000);