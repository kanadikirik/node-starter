const express    = require('express'),
      bodyParser = require('body-parser'),
      logger     = require('morgan');
      app        = express();
      
const config = require('./config');
app.set('API_SECRET_KEY', config.API_SECRET_KEY);
app.set('DB_URL', config.DB_URL);

const indexRouter = require('./routes/indexRoutes');
const userRouter  = require('./routes/userRoutes');
      
// Database Connection
const db = require('./helpers/db.js')();    

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));


app.use('/', indexRouter);
app.use('/user', userRouter);

const Middlewares = require('./middlewares/Middlewares');
app.use(Middlewares.error.handleError);

const server = app.listen(8081,(err)=>{
  if(err)
    return console.log(err);
  console.log('No doubt at %d',server.address().port);
})
