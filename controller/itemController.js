const Item=require("../models/items")

const getItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch item", details: err.message });
    }
};

const getItems = async (req, res) => {
    try {
        const item = await Item.find();
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch items", details: err.message });
    }
};

module.exports={getItem, getItems}