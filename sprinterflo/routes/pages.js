const express= require('express');

const router=express.Router();

router.get('/',(req,res)=>{
    res.render('index');
});

router.get('/register',(req,res)=>{
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/dashboard', (req, res) => {
    // if (!req.session.userId) {
    //     return res.redirect('/login');
    // }
    
    res.render('dashboard');
});

router.get('/popup', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.render('popup');
});


module.exports = router;