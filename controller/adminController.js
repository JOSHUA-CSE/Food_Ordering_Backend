const Item=require("../models/items")
const addItem=async (req,res)=>{
    const newItem={
        name:req.body.name,
        price:req.body.price,
        image:req.body.image,
        category:req.body.category,
        availability:req.body.availability
    }
    const item = await Item.create(newItem);
        res.status(201).json({
            success: "Item Added",
            item: item
    });
}
const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const allowed = ["name", "price", "image", "category", "availability"];
        const updates = {};
        allowed.forEach((key) => {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        });

        const updated = await Item.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            return res.status(404).json({ error: "Item not found" });
        }

        return res.status(200).json({ success: "Item Updated", item: updated });
    } catch (err) {
        return res.status(500).json({ error: "Failed to update item", details: err.message });
    }
};
const deleteItem=async (req,res)=>{
    try{
        const item=await Item.findById(req.params.id);
        if(!item){
            return res.status(404).json({error:"Item not found"});
        }
        res.status(200).json(item);
    }catch(err){
        res.status(500).json({error:"Failed to fetch item", details: err.message});
    }
}

module.exports={addItem, updateItem, deleteItem}