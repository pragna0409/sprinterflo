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

router.get('/settings', (req, res) => {

    res.render('settings');
});

router.get('/about', (req, res) => {

    res.render('about');
}); 

router.get('/fridge', (req, res) => {
    //if (!req.session.userId) {
    //  return res.redirect('/login');
    //}
    res.render('fridge');
});

router.get('/exercise', (req, res) => {
   
    res.render('exercise');
});



router.get('/popup', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.render('popup');
});


module.exports = router;