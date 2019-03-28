const express = require('express');
const path = require('path');
const logger = require('morgan');
const exphbs = require('express-handlebars');
const app = express();

if(process.env.NODE_ENV != 'production')
    require('dotenv').config();

app.set('port', process.env.APP_PORT || 5001);
app.use(logger('dev'));
require('./config/mongoose');
require('./config/multer')(app);

//api
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
require('./routes')(app);

//views
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));

//static files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), 
    () => console.log(`[Server running on port: ${[app.get('port')]}]`));