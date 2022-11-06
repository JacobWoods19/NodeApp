const express = require('express');
const http = require('http');
const bcrypt = require('bcrypt');
const path = require("path");
const bodyParser = require('body-parser');
const users = require('./data').userDB;

const app = express();



const server = http.createServer(app);

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public'));
app.use('/js', express.static(__dirname + '/public/js'));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');



app.get('/',(req,res) => {
    //call api to get data for the page
    
    res.render('index', {user_name: "test"})
});


server.listen(8181, function(){
    console.log("server is listening on port: 8080");
});