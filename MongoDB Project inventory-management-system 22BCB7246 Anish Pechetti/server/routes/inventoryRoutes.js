const express = require('express')
const router = express.Router()
const InventoryItem = require('../models/InventoryItem')
const {protect} = require('../middleware/authMiddleware')
router.get('/', protect, async (req, res) =>
{
	try
	{
		const items = await InventoryItem.find({})
		res.json(items)
	} catch (error)
	{
		console.error('Error fetching inventory items:', error.message)
		res.status(500).json({message: 'Server error fetching inventory items'})
	}
})
router.post('/', protect, async (req, res) =>
{
	const {name, quantity, price} = req.body
	if (!name || !quantity || !price)
	{
		return res.status(400).json({message: 'Please enter all fields'})
	}
	try
	{
		const existingItem = await InventoryItem.findOne({name})
		if (existingItem)
		{
			return res.status(400).json({message: 'An item with this name already exists.'})
		}
		const newItem = new InventoryItem({
			name,
			quantity,
			price,
		})
		const savedItem = await newItem.save()
		res.status(201).json(savedItem)
	} catch (error)
	{
		console.error('Error adding inventory item:', error.message)
		res.status(500).json({message: 'Server error adding inventory item'})
	}
})
router.put('/:id', protect, async (req, res) =>
{
	const {name, quantity, price} = req.body
	try
	{
		let item = await InventoryItem.findById(req.params.id)
		if (!item)
		{
			return res.status(404).json({message: 'Item not found'})
		}

		item.name = name || item.name
		item.quantity = quantity !== undefined ? quantity : item.quantity
		item.price = price !== undefined ? price : item.price
		const updatedItem = await item.save()
		res.json(updatedItem)
	} catch (error)
	{
		console.error('Error updating inventory item:', error.message)
		if (error.name === 'CastError')
		{
			return res.status(400).json({message: 'Invalid item ID'})
		}
		res.status(500).json({message: 'Server error updating inventory item'})
	}
})
router.delete('/:id', protect, async (req, res) =>
{
	try
	{
		const item = await InventoryItem.findById(req.params.id)
		if (!item)
		{
			return res.status(404).json({message: 'Item not found'})
		}
		await item.deleteOne()
		res.json({message: 'Item removed'})
	} catch (error)
	{
		console.error('Error deleting inventory item:', error.message)
		if (error.name === 'CastError')
		{
			return res.status(400).json({message: 'Invalid item ID'})
		}
		res.status(500).json({message: 'Server error deleting inventory item'})
	}
})
module.exports = router