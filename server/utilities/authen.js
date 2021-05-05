var jwt = require('jsonwebtoken');
var secret = 'mysecret';

exports.authenticate = function (req, res, next){
    let {token} = req.session
    if (token){
        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                res.redirect('/login')
            }else{
                next();
            }
        });

    }else{
        res.redirect('/login')
    }
}