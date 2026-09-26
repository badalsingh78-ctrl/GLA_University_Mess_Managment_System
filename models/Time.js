const mongoose = require("mongoose");

// Updated schema definition with validations and constraints
const TimeSchema = mongoose.model("time", new mongoose.Schema({
    meal: { type: String, required: true, enum: ["breakfast", "lunch", "dinner"] },
    time: { type: String, required: true },
    cost: { type: Number, required: true, min: 0 }
}));

// Get the cost and time of breakfast, lunch, dinner
module.exports.getTimes = async function () {
    const Times = await TimeSchema.find({})
        .select({ _id: 0 });
    return Times;
}

// Set the cost and time of breakfast, lunch, dinner
module.exports.setTimes = async function (times) {
    await TimeSchema.deleteMany({});
    await TimeSchema.insertMany(times);
}

// Auto-populate default time data if collection is empty
mongoose.connection.once('open', async () => {
    try {
        const count = await TimeSchema.countDocuments();
        if (count === 0) {
            const defaultTimes = [
                { meal: "breakfast", time: "8:00 AM", cost: 50 },
                { meal: "lunch", time: "1:00 PM", cost: 100 },
                { meal: "dinner", time: "8:00 PM", cost: 120 }
            ];
            await TimeSchema.insertMany(defaultTimes);
            console.log("Default time data inserted");
        }
    } catch (err) {
        console.error("Error populating default time data", err);
    }
});