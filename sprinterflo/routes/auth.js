const express= require('express');
const authController=require('../controllers/auth');
const router=express.Router();

router.post('/register', authController.register)

router.post('/login', authController.login);
const mysql = require("mysql");
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB
});

router.post('/popup', (req, res) => {
    const userId = req.session.userId;
    const {
        age,
        menstrualLength,
        meanCycleLength,
        sport,
        weight,
        height,
        bodyType
    } = req.body;

    db.query('UPDATE users SET age=?, menstrual_length=?, mean_cycle_length=?, sport=?, weight=?, height=?, body_type=? WHERE id=?',
        [age, menstrualLength, meanCycleLength, sport, weight, height, bodyType, userId],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.send('Error saving data');
            }

            res.redirect('/');
        }
    );
});

module.exports = router;