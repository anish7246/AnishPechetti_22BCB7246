const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const generateToken = (id) =>
{
	return jwt.sign({id}, process.env.JWT_SECRET, {
		expiresIn: '1h',
	})
}
router.post('/register', async (req, res) =>
{
	const {username, password} = req.body
	try
	{
		let user = await User.findOne({username})
		if (user)
		{
			return res.status(400).json({message: 'User already exists'})
		}
		user = await User.create({username, password})
		if (user)
		{
			res.status(201).json({
				_id: user._id,
				username: user.username,
				token: generateToken(user._id),
				message: 'User registered successfully'
			})
		} else
		{
			res.status(400).json({message: 'Invalid user data'})
		}
	} catch (error)
	{
		console.error('Registration error:', error.message)
		res.status(500).json({message: 'Server error during registration'})
	}
})
router.post('/login', async (req, res) =>
{
	const {username, password} = req.body
	try
	{
		const user = await User.findOne({username})
		if (!user)
		{
			return res.status(400).json({message: 'Invalid credentials'})
		}
		const isMatch = await user.matchPassword(password)
		if (!isMatch)
		{
			return res.status(400).json({message: 'Invalid credentials'})
		}
		res.json({
			_id: user._id,
			username: user.username,
			token: generateToken(user._id),
			message: 'Logged in successfully'
		})
	} catch (error)
	{
		console.error('Login error:', error.message)
		res.status(500).json({message: 'Server error during login'})
	}
})
module.exports = router