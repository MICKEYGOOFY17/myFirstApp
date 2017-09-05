const router = require('express').Router();
const userController = require('./userController');
let jwt    = require('jsonwebtoken');
let cfg = require('../../config');
let params = {
    secretOrKey: cfg.jwtSecret
};

router.post('/signup', (req,res) => {
  console.log('here');
  userController.saveUser(req.body, function(result){
    res.status(201).json({success: result});
  },
function(error) {
  console.log(error);
  res.status(404).json({error: error})
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
  }, function(error){
    res.status(500).json({
      error: error
    })
  });
});

router.get('/showuser', (req,res) => {
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

router.put('/updatefavorite', (req,res) => {
  userController.updateFavorite(req.body.username, req.body.restaurant, req.body.perform, function(result, err){
    if(err) {
      res.send(err);
    } else if(result.ok === 1) {
      res.send({success: 'success'});
    } else {
      res.send({success: 'failed'});
    }
  });
});

module.exports = router;
