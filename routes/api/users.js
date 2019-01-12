const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys.js');
const passport = require('passport');

//load input validation
const validateRegisterInput = require('../../validation/register.js'); 
const validateLoginInput = require('../../validation/login.js'); 


//Load user model
const User = require('../../models/User.js');

// @route /api/user/test
// @desc testing
// @access public

router.get('/test', (req,res) => res.json({
    msg: "Users works"
}));

// @route /api/user/rgister
// @desc Registeration of user
// @access public

router.post('/register', (req, res) => {
    const {errors, isValid} = validateRegisterInput(req.body);

    //check validation
    if(!isValid){
        return res.status(400).json(errors);
    }


    User.findOne({email: req.body.email})
    .then(user => {
        if(user){
            errors.email = 'Email already exists'
            return res.status(400).json(errors);
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200', //size
                r: 'pg', //rating
                d: 'mm' //default
            });

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                avatar
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

// @route /api/user/login
// @desc Login of user/returning jwt
// @access public

router.post('/login', (req, res) => {
    const {errors, isValid} = validateLoginInput(req.body);

    //check validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
    .then(user => {
        //check user
        if(!user){
            errors.email = 'User not found';
            return res.status(404).json(email);
        }

        //check for password
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if(isMatch){
                    //User matched
                    const payload = {
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar
                    };
                    //sign token
                    jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
                        res.json({
                            success: true,
                            token: 'Bearer ' + token
                        });
                    });
                } else {
                    errors.password = 'Incorrect password';
                    res.status(400).json(errors);
                }
            });
    });
});

// @route /api/user/current
// @desc Return current user
// @access private

router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});

module.exports = router;

