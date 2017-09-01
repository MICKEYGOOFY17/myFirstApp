const userModel = require('./../../models/user');

let saveUser = function(userObj) {
  let user = new userModel(userObj);
  user.save(function(err) {
    if(err) {
      console.log('error in creating'+ err);
      return err;
    }
    else {
      console.log('created successfully');
      return 'success'
    }
  })
}

module.exports = {
  saveUser: saveUser
}
