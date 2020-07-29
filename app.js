const express=require('express');
const mongoose=require('mongoose')
const dotenv=require('dotenv');  //for config the variables
const connectDB=require('./config/db')
const exphbs=require('express-handlebars');
const methodOverride=require('method-override')
const path=require('path');
const passport=require('passport');
const session=require('express-session');
const MongoStore=require('connect-mongo')(session);


const morgan=require('morgan');
dotenv.config({path:'./config/config.env'});

//passport config
require('./config/passport')(passport)

const app=express();
//body parser
app.use(express.urlencoded({extended:false}))
app.use(express.json())
//Method Override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

if(process.env.NODE_ENV==='development'){
  app.use(morgan('dev'));
}

const{formatDate,truncate,stripTags,editIcon,select} =require('./helper/hbs')

app.engine('.hbs',  exphbs({helpers:{
  formatDate,
  truncate,
  stripTags,
  editIcon,
  select,
},
  defaultLayout:'main',extname:'.hbs'}));
app.set('view engine','.hbs')

//session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store:new MongoStore({mongooseConnection:mongoose.connection})
}))


//passport middleware
app.use(passport.initialize());
app.use(passport.session())

//set global variables
app.use((req,res,next)=>{
  res.locals.user=req.user ||null
  next()
})


//static folder

app.use(express.static(path.join(__dirname,'public')))

app.use('/',require('./routes/index'));
app.use('/auth',require('./routes/auth'));
app.use('/stories',require('./routes/stories'))

connectDB();

const PORT=process.env.PORT || 5000;

app.listen(PORT,console.log(`Server is running in ${process.env.NODE_ENV} mode on Port ${PORT}`));