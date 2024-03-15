const db = require('../models/ItemModel');

const itemController = {};

itemController.getItems = (req, res, next) => {
  const querystr = 'Select * From Item WHERE purchased = false ORDER By id DESC';
  db.query(querystr)
    .then((data) => {
      res.locals.items = data.rows;
      return next();
    })
    .catch((err) => {
      return next({
        log: `itemController.getItems query fail: ${err}}`,
        message: 'itemController.getItems query fail'
      });
    }); 
};

itemController.purchaseItem = (req, res, next) => {
  const querystr = 'UPDATE ITEM SET purchased = true WHERE id = $1 RETURNING *';
  const {id} = req.body;

  db.query(querystr, [id])
    .then((data) => {
      res.locals.purchasedItem = data.rows;
      return next();
    })
    .catch((err) => {
      return next({
        log: `itemController.purchaseItem  query fail: ${err}}`,
        message: 'itemController.purchaseItem  query fail'
      });
    }); 
};

itemController.postItem = (req, res, next) => {
  const querystr = 'INSERT INTO item (description, price) VALUES ($1, $2) RETURNING *';
  const {description, price} = req.body;
  db.query(querystr, [description, price])
    .then((data) => {
      res.locals.postedItem = data.rows[0];
      return next();
    })
    .catch((err) => {
      return next({
        log: `itemController.postItem  query fail: ${err}}`,
        message: 'itemController.postItem  query fail'
      });
    }); 
};


module.exports = itemController;