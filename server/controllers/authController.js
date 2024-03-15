const db = require('../models/ItemModel');

const authController = {};

authController.login = (req, res, next) => {

  const {user: username, pass: password} = req.body;
  console.log(username, password);
  const querystr = 'Select * From users WHERE username = $1';
  db.query(querystr, [username])
    .then((data)=>{
      if(data.rows[0]?.password == password){
        res.locals.type = username;
      }else{
        res.locals.fail = true;
      }
      return next();
    })
    .catch((err) => {
      return next({
        log: `authController.login query fail: ${err}}`,
        message: 'authController.login query fail'
      });
    }); 
};

authController.setCookie = (req, res, next) => {
  try{
    if(!res.locals.fail){
      const type = res.locals.type;
      res.cookie('token', type);
    }
    return next();
  }
  catch (err){
    console.warn(err);
  }
};

authController.verifyUser = (req, res, next) => {
  try{
    const {token} = req.cookies;
    if(token == 'seller' || token == 'buyer'){
      return next();
    }else{
      res.redirect('/');
    }
  }
  catch (err){
    return next({
      log: `authController.verifyUser cookies fail: ${err}}`,
      message: 'authController.verifyUser cookies fail'
    });
  }
};

authController.seller = (req, res, next) => {
  try{
    const {token} = req.cookies;
    if(token == 'seller'){
      return next();
    }else{
      return res.json('Only sellers can post');
    }
  }
  catch (err){
    return next({
      log: `authController.seller cookies fail: ${err}}`,
      message: 'authController.seller cookies fail'
    });
  }
};

authController.buyer = (req, res, next) => {
  try{
    const {token} = req.cookies;
    if(token == 'buyer'){
      return next();
    }else{
      return res.json('Only buyers can purchase');
    }
  }
  catch (err){
    return next({
      log: `authController.buyer cookies fail: ${err}}`,
      message: 'authController.buyer cookies fail'
    });
  }
};


module.exports = authController;

