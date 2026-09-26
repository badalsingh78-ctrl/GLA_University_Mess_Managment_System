const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  orderid: { type: String, index: true, unique: true },
  selected: Object,
});
const OrderModel = mongoose.model("order", OrderSchema);

module.exports.saveOrder = async function (orderid, selected) {
  await OrderModel.updateOne({ orderid }, { $set: { selected } }, { upsert: true });
};
module.exports.getOrder = async function (orderid) {
  return await OrderModel.findOne({ orderid });
};
module.exports.deleteOrder = async function (orderid) {
  await OrderModel.deleteOne({ orderid });
};
