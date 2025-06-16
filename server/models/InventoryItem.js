const mongoose = require('mongoose')
const InventoryItemSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	quantity: {
		type: Number,
		required: true,
		min: 0
	},
	price: {
		type: Number,
		required: true,
		min: 0
	},
}, {
	timestamps: true
})
const InventoryItem = mongoose.model('InventoryItem', InventoryItemSchema)
module.exports = InventoryItem