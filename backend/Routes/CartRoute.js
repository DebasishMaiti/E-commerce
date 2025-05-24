const express = require('express');
const { getCartById, addToCart, removeFromCart, deleteCart } = require('../Controller/CartController');

const router = express.Router();

router.get('/getcart/:id', getCartById);
router.post('/addtocart/:id', addToCart);
router.delete('/removeproduct/:id', removeFromCart);
router.delete('/deletecart/:id', deleteCart);


module.exports = router;