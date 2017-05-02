var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');

var db = mongojs('mongo/customerapp', ['people']); // App & MongoDB - docker-compose
// var db = mongojs('192.168.99.100/customerapp', ['people']); // MongoDB - docker Container
// var db = mongojs('customerapp', ['people']); // App & MongoDB - local host

db.on('connect', function () {
    console.log('database connected')
});

var app = express();

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
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));


app.get("/", function (req, res) {
    db.people.find(function (err, docs) {
        if (err) {
            res.send(err);
        } else {
            res.render('index', {
                title: 'Customers',
                users: docs
            });
        }
    });
});

app.post("/users/add", function (req, res) {

    req.checkBody('first_name', 'First Name is required').notEmpty();
    req.checkBody('last_name', 'Last Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.render('index', {
            title: 'Customers',
            users: [{}],
            errors: errors
        });
    } else {
        var newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        };

        db.people.insert(newUser, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log('SUCCESS !!!');
                res.redirect('/');
            }
        });

    }
});

app.delete('/users/delete/:id', function (req, res) {
    db.people.remove({
        _id: mongojs.ObjectId(req.params.id, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/');
            }
        })
    });
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});