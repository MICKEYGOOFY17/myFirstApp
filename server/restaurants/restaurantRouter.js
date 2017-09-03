const router = require('express').Router();
let restaurantController = require('./restaurantController');

router.post('/savefavorite', (req,res) => {
  restaurantController.saveFavorite(req.body.username, req.body.restaurant, req.body.favId, function(result){
    console.log(result);
    if(result.ok === 1) {
      res.send({success: 'success'});
    } else {
      res.send({success: 'failed'});
    }
  });
});

router.post('/removefavorite', (req,res) => {
  restaurantController.removeFavorite(req.body.username, req.body.restaurant, req.body.favId, function(result){
    console.log(result);
    if(result.ok === 1) {
      res.send({success: 'success'});
    } else {
      res.send({success: 'failed'});
    }
  });
});

module.exports = router;
