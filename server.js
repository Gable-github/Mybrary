//require this module only if in production and not deployment on heroku
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
};
//require express module for easier connection and routing 
const express = require('express');
//create a "local" instance of express with 'app'
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
//require mogoose which makes connection and manipulation of DB far simpler
const mongoose = require('mongoose');
//require the index file
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', (error) => console.error(error));
mongoose.connection.once('open', () => console.log('Connected to DB'));

//setting view engine to EJS allows us to use static template HTML files in production
//where they have access to JS variables with the help of EJS
app.set('view engine', 'ejs');
//set which folder template files
app.set('views', __dirname + '/views');
//lastly, hook up express layouts
//This express-ejs-layouts allows you to duplicate the header and footer section
//of your website.
//app.set(NAME, LOCATION)
app.set('layout', 'layouts/layout');
//Use the expressLayouts middleware/module located in layouts/layout
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}));

//use indexRouter to handle incoming get requests at '/'
//app.use for using middleware
app.use('/', indexRouter);

app.use('/authors', authorRouter);

app.use('/books', bookRouter);
 
app.listen( process.env.PORT || 3000);