const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    product: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const cartModel = new mongoose.model('cart', cartSchema);

module.exports = cartModel;