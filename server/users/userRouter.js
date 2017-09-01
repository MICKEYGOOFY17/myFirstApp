const router = require('express').Router();
const userController = require('./userController');

router.post('/login', (req,res) => {
  let result = userController.saveUser(req.body);
  console.log(result);
  res.send({success: result});
});

module.exports = router;
