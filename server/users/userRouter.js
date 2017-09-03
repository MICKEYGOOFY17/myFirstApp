const router = require('express').Router();
const userController = require('./userController');
let jwt    = require('jsonwebtoken');
let cfg = require('../../config');
let params = {
    secretOrKey: cfg.jwtSecret
};

router.post('/signup', (req,res) => {
  userController.saveUser(req.body, function(result){
    console.log(result);
    res.send({success: result});
  });
});

router.post('/login', (req,res) => {
  userController.findUser(req.body, function(result){
    if(result !== null) {
      var token = jwt.sign(result, params.secretOrKey, {
          // expiresInMinutes: 1440 // expires in 24 hours
        });
      res.send({
                token: token
            })
    }
  });
});

router.get('/showUser', (req,res) => {
  let token = req.headers.authorization;
  jwt.verify(token, params.secretOrKey, function(err, decoded) {
    if (err) {
      res.send({ success: false, message: 'Failed to authenticate token.' });
    } else {
      // if everything is good, save to request for use in other routes
      userController.getUser(decoded._doc.username, function(result) {
        res.send({success: true, user: result});
      })
    }
  });
});

module.exports = router;
