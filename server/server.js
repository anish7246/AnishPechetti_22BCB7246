const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const inventoryRoutes = require('./routes/inventoryRoutes')
dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
const connectDB = async () =>
{
	try
	{
		await mongoose.connect(process.env.MONGO_URI)
		console.log('MongoDB Connected Successfully!')
	} catch (error)
	{
		console.error(`MongoDB Connection Error: ${error.message}`)
		process.exit(1)
	}
}
connectDB()
app.use('/api/auth', authRoutes)
app.use('/api/inventory', inventoryRoutes)
app.get('/', (req, res) =>
{
	res.send('Inventory Management API is running...')
})
app.use((err, req, res, next) =>
{
	console.error(err.stack)
	res.status(500).send('Something broke!')
})
const PORT = process.env.PORT || 5000
app.listen(PORT, () =>
{
	console.log(`Server running on port ${PORT}`)
})