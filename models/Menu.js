const mongoose = require("mongoose");

const MenuSchema = mongoose.model("menuitem", new mongoose.Schema({
    day: { type: String, required: true, enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] },
    breakfast: { type: String, required: true },
    lunch: { type: String, required: true },
    dinner: { type: String, required: true }
}));

// Get the weekly menu
module.exports.getMenu = async function () {
    const menuItems = await MenuSchema.find({})
        .select({ _id: 0 });
    return menuItems;
}

// Set the weekly menu
module.exports.setMenus = async function (menus) {
    await MenuSchema.deleteMany({});
    await MenuSchema.insertMany(menus);
}

// Auto-populate default menu data if collection is empty
mongoose.connection.once('open', async () => {
    try {
        const count = await MenuSchema.countDocuments();
        if (count === 0) {
            const defaultMenus = [
                { day: "monday", breakfast: "Pancakes", lunch: "Rice and curry", dinner: "Pizza" },
                { day: "tuesday", breakfast: "Omelette", lunch: "Chicken sandwich", dinner: "Burger" },
                { day: "wednesday", breakfast: "Toast", lunch: "Pasta", dinner: "Salad" },
                { day: "thursday", breakfast: "Cereal", lunch: "Steak", dinner: "Soup" },
                { day: "friday", breakfast: "Bagel", lunch: "Fish and chips", dinner: "Fries" },
                { day: "saturday", breakfast: "Eggs", lunch: "Sandwich", dinner: "Stew" },
                { day: "sunday", breakfast: "Waffles", lunch: "Pasta", dinner: "Roast" }
            ];
            await MenuSchema.insertMany(defaultMenus);
            console.log("Default menu data inserted");
        }
    } catch (err) {
        console.error("Error populating default menu data", err);
    }
});