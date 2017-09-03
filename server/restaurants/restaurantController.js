const userModel = require('./../../models/user');

let saveFavorite = function(username, restaurant, favId, successCB, errorCB) {
  console.log(username);
  userModel.update({username: username},{$push:{Restaurant: restaurant, favIds: favId}}, function(err,result) {
    if(err) {
      errorCB(err);
    }
    successCB(result);
  })
}

let removeFavorite = function(username, restaurant, favId, successCB, errorCB) {
  console.log(username);
  userModel.update({username: username},{$pull:{Restaurant: restaurant, favIds: favId}}, function(err,result) {
    if(err) {
      errorCB(err);
    }
    successCB(result);
  })
}

module.exports = {
  saveFavorite: saveFavorite,
  removeFavorite: removeFavorite
}
