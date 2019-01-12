const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data){
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if(Validator.isEmpty(data.email)){
        errors.email = 'E-mail is required';
    }

    if(!Validator.isEmail(data.email)){
        errors.email = 'Enter a valid e-mail';
    }

    if(Validator.isEmpty(data.password)){
        errors.password = 'Password is required';
    }

    if(!Validator.isLength(data.password, {min: 6, max: 30})){
        errors.password = 'Password must between 6 and 30 characters';
    }

    return {
        errors,
        isValid: isEmpty(errors) 
    };
};