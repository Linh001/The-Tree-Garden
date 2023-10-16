const nodemailer = require('nodemailer');

const express = require("express");
const morgan = require("morgan");

const { engine } = require('express-handlebars');


const methodOverride=require('method-override');


const authRouter=require('./routes/auth');


const db = require('./config/db/index');
db.connect();

const path = require("path");
const app = express();
const port = 3000;
var cookieParser = require('cookie-parser')
app.use(cookieParser())
//HTTP logger
// app.use(morgan("combined"));



const fuzzy = require('fuzzy');

const options = {
  pre: '<', // Tiền tố trước kết quả
  post: '>', // Hậu tố sau kết quả
  extract: el => el.name, // Hàm trích xuất văn bản cần tìm kiếm gần đúng
};

const list = [
  { name: 'apple' },
  { name: 'banana' },
  { name: 'cherry' },
];

const results = fuzzy.filter('ban', list, options);
const matches = results.map(result => result.string);

console.log(matches); // ['<banana>']





//Template engine

app.engine('hbs', engine({
  extname: '.hbs',
  helpers: {
    sum: (a, b) => a + b
  }
}));
app.set('view engine', 'hbs');
app.set("views", path.join(__dirname, "resources", "views"));
app.use(methodOverride('_method'));




//static file
app.use(express.static(path.join(__dirname, 'public')));



app.use(express.json()); // Cho JSON requests
app.use(express.urlencoded({ extended: true }));



// const {createJWT,verifyToken}=require('./middleware/JWTAction.js');
const bookRoute = require('./routes/book.js');
// createJWT();
// verifyToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWluaCBIdXUiLCJhZGRyZXNzIjoiaGEgbm9pIiwiaWF0IjoxNjk0NDAwMDUxfQ.V-q5aYugCKWtHk4GngPmvh3TzK4fuMubOFyHlcf-GMM');






//route
authRouter(app);
bookRoute(app);


// 127.0.0.1 - localhost:3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
