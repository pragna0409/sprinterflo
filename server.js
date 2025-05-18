const express = require("express");
const path=require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');
const session = require('express-session');
dotenv.config({path: './.env'});
const authRoutes = require('./sprinterflo/routes/auth');

const app = express();
// console.log(process.env.DB_HOST);
// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB
});

const publicDirectory= path.join(__dirname,'sprinterflo/public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({extended:false}));

app.use(express.json());

console.log(__dirname);
app.set('view engine','hbs');

db.connect( (error) => {
    if(error){
        console.log(error)
    }else{
        console.log("MYSQL connected")
    }
})
app.use(session({
    secret: 'sprinterfloSecretKey',
    resave: false,
    saveUninitialized: false
}));
app.use('/', require('./sprinterflo/routes/pages'));
app.use('/auth',require('./sprinterflo/routes/auth'));
app.use(authRoutes);
app.set('views', path.join(__dirname, 'sprinterflo/views')); // If this is inside sprinterflo//

  app.listen(5000, () => { 
    console.log('Server running on http://localhost:5000');
  })

