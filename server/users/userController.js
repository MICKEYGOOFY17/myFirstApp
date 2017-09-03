const crypto = require('crypto');
const userModel = require('./../../models/user');

let saveUser = function(userObj, successCB, errorCB) {
  const cipher = crypto.createCipher('aes192', 'password');
  let encrypted = cipher.update(userObj.password, 'utf8', 'hex');
  encrypted = cipher.final('hex');

  userObj.password = encrypted;
  let user = new userModel(userObj);
  user.save(function(err) {
    if(err) {
      console.log('error in creating'+ err);
      errorCB(err);
    }
    else {
      console.log('created successfully');
      successCB('success');
    }
  })
}

let findUser = function(userObj, successCB, errorCB) {
  const cipher = crypto.createCipher('aes192', 'password');
  let encrypted = cipher.update(userObj.password, 'utf8', 'hex');
  encrypted = cipher.final('hex');

  userObj.password = encrypted;

  userModel.findOne(userObj, function(err, res) {
    if(err) {
      console.log('error in finding user' + err);
      errorCB(err);
    }
    else {
      successCB(res);
    }
  })
}

let getUser = function(user, successCB, errorCB) {
  userModel.findOne({username: user}, function(err, res) {
    if(err) {
      console.log('error in finding user' + err);
      errorCB(err);
    }
    else {
      successCB(res);
    }
  })
}

module.exports = {
  saveUser: saveUser,
  findUser: findUser,
  getUser: getUser
}
