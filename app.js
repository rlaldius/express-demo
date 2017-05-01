var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');

var db = mongojs('192.168.99.100/çustomerapp');

db.on('connect', function () {
    console.log('database connected')
});

var app = express();

// var logger = function (req, res, next) {
//     console.log("logging ......")
//     next()
// }
//
// app.use(logger)

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set static path
app.use(express.static(path.join(__dirname, 'public')));

// Global Vars
app.use(function (req, res, next) {
     res.locals.errors = null;
     next();
});

// Express Validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

var users = [
    {
        id: 1,
        first_name: 'Teff',
        last_name: 'Burry',
        email: 'tBurry@gmail.com'
    },
    {
        id: 2,
        first_name: 'John',
        last_name: 'Doe',
        email: 'jDoe@gmail.com'
    },
    {
        id: 3,
        first_name: 'Valo',
        last_name: 'Pell',
        email: 'vPell@gmail.com'
    }
];

app.get("/", function (req, res) {

    db.users.find(function (err, docs) {

        if(err) {
            console.log(err)
        } else {
            console.log(docs);
        }

        res.render('index', {
            title: 'Customers',
            users: users
        });
    })


});

app.post("/users/add", function (req, res) {

    req.checkBody('first_name', 'First Name is required').notEmpty();
    req.checkBody('last_name', 'Last Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();

    var errors = req.validationErrors();

    if(errors) {
        res.render('index', {
            title: 'Customers',
            users: users,
            errors: errors
        })
    } else {
        var newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        };
        console.log('SUCCESS !!!');
    }
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});