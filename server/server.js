const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const cookieParser = require('cookie-parser');
const authController = require('./controllers/authController');
const itemController = require('./controllers/itemController');
const port = 3333;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.resolve(__dirname, '../assets'), {setHeaders: (res)=> res.set('Content-Type', 'application/json')}));

app.use('/', router);

router.get('/', (req, res)=> res.sendFile(path.resolve(__dirname, '../views/index.html')));
router.get('/store', authController.verifyUser, (req, res)=> res.sendFile(path.resolve(__dirname, '../views/store.html')));

router.get('/items', itemController.getItems, (req, res)=> res.json(res.locals.items));
router.put('/items', authController.buyer, itemController.purchaseItem, (req, res)=> res.json(res.locals.purchasedItem));
router.post('/items', authController.seller, itemController.postItem, (req, res)=> res.json(res.locals.postedItem));


router.post('/signin', authController.login, authController.setCookie, (req,res)=>{
  if(!res.locals.fail) res.redirect('/store'); 
  else res.json('unsuccessful login attempt');
});


app.use((req, res, next) => {
  res.status(404).send('Page not found!');
});

app.use((err, req, res, next) => {
  console.error(err);
  const defaultObj = {
    log: 'Generic Error in middleware',
    status: 500,
    message: 'Generic Error',
  };
  const errObj = Object.assign({}, defaultObj, err);
  res.status(500).send(errObj.message);
});

app.listen(port, ()=>console.log(`Listening on ${port}`));