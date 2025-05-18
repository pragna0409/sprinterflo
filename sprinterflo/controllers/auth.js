const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // bcryptjs is fine too

let dbPromise = require('../controllers/db');

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    console.error('JWT_SECRET is not set in the environment variables.');
    process.exit(1);
}

exports.register = async (req, res) => {
    const db = await dbPromise;

    const { name, email, password, passwordConfirm } = req.body;

    const [results] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    console.log(results);
    
    if (results.length > 0) {
            return res.render('register', {
                message: 'Email already taken'
            });
    } 
    else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Passwords do not match'
            });
    }

    const hashedPassword = await bcrypt.hash(password, 8)
    const [r] = await db.execute(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
    );
    console.log(r);
    req.session.userId = r.insertId; // save user ID in session
    return res.redirect('/popup');
//     , (error, results) => {
//                 if (error) {
//                     console.log(error);
//                 } else {
//                     console.log(results);

//                 }
//             });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
        const db = await dbPromise;


    const [results] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
        return res.render('login', {
            message: 'Email or password is incorrect.'
        });
    }
    // Create JWT and send to Handlebars if login is successful
    const user = results[0];
    const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    const userData = JSON.stringify({
            id: user.id,
            name: user.name
        });
        
    res.render('login', {
        jwt: token,
        user: userData,
        message: null
    });
    /* 
        , async (err, results) => {
        if (err) {
            console.log(err);
            return res.render('login', {
                message: 'An error occurred.'
            });
        }


    }); */
};
