const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // bcryptjs is fine too

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB
});

exports.register = (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.render('register', {
                message: 'Email already taken'
            });
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Passwords do not match'
            });
        }

        // ✅ Use bcrypt hash with callback
        bcrypt.hash(password, 8, (err, hashedPassword) => {
            if (err) {
                console.log(err);
                return res.send('Error hashing password');
            }

            console.log(hashedPassword);

            // ✅ Save to DB — KEEP ONLY THIS INSERT
            db.query('INSERT INTO users SET ?', { name, email, password: hashedPassword }, (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(results);
                    req.session.userId = results.insertId; // save user ID in session
return res.redirect('/popup');

                }
            });
        });
    });
};
exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.log(err);
            return res.render('login', {
                message: 'An error occurred.'
            });
        }

        if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
            return res.render('login', {
                message: 'Email or password is incorrect.'
            });
        }

        // TODO: Set session or JWT — for now just show success
            res.render('index', {
        message: 'Logged in successfully!',
        showPopup: true // or false
    });
    });
};
