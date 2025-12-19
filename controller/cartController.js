const Cart = require("../models/carts");
const Item = require("../models/items");

const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.userData.id })
    .populate("items.item");
  
  if (!cart) {
    return res.status(200).json({ message: "Cart not found", cart: [] });
  }
  
  res.status(200).json({ cart });
};

const addToCart = async (req, res) => {
  const { itemId, quantity } = req.body;
  const cart = await Cart.findOne({ user: req.userData.id });

  if(!cart) {
    // create a cart and add
    const newCart = await Cart.create({ user: req.userData.id, items: [{ item: itemId, quantity }] });
    return res.status(200).json({ message: "Cart created", cart: newCart });
  }
  const item = await Item.findById(itemId);
  if(!item) {
    return res.status(404).json({ error: "Item not found" });
  }
  cart.items.push({ item: itemId, quantity });
  await cart.save();
  res.status(200).json({ message: "Item added to cart", cart });
}


const updateCart= async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.userData.id });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const itemItem = cart.items.find(
      (item) => item.item.toString() === itemId
    );

    if (!itemItem) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    itemItem.quantity = quantity;

    await cart.save();

    res.status(200).json({
      message: "Cart updated successfully",
      cart,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const deleteCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.userData.id });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.item.toString() !== itemId
    );

    await cart.save();

    res.status(200).json({
      message: "Item removed from cart",
      cart,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { getCart, addToCart,updateCart,deleteCart};