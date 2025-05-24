const cartModel = require('../Model/CartModel');

exports.getCartById = async (req, res) => {
    try {
        const cart = await cartModel.find({ user: req.params.id });
        res.status(200).send({
            cart
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'error in get cart',
            error
        })
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { product } = req.body;
        const { id } = req.params;
        console.log(product);

        let cart = await cartModel.findOne({ user: id });
        if (!cart) {
            cart = new cartModel({
                user: id,
                product: [product]
            });
        } else {
            cart.product.push(product);
        }

        await cart.save();

        res.status(200).send({
            message: "Product added to cart",
            cart
        });

    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).send({
            message: "Error in adding to cart",
            error
        });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        const { product } = req.body;

        const cart = await cartModel.findOne({ user: id });

        if (!cart) {
            return res.status(404).send({ message: "Cart not found for this user" });
        }

        cart.product = cart.product.filter(
            (item) => item.toString() !== product
        );

        await cart.save();

        res.status(200).send({
            message: "Product removed from cart",
            cart
        });

    } catch (error) {
        console.error("Remove from cart error:", error);
        res.status(500).send({
            message: "Error in removing product from cart",
            error
        });
    }
};

exports.deleteCart = async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await cartModel.findOneAndDelete({ user: id });
        res.status(200).send({
            message: "Cart Deleted",
            cart
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in Delete cart",
            error
        });
    }
}

