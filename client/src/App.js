import {useCallback, useEffect, useState} from 'react'
const App = () =>
{
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [currentUser, setCurrentUser] = useState(null)
	const [loading, setLoading] = useState(true)
	useEffect(() =>
	{
		const token = localStorage.getItem('token')
		const user = localStorage.getItem('user')
		if (token && user)
		{
			try
			{
				setCurrentUser(JSON.parse(user))
				setIsAuthenticated(true)
			} catch (error)
			{
				console.error('Failed to parse user from localStorage:', error)
				localStorage.removeItem('token')
				localStorage.removeItem('user')
			}
		}
		setLoading(false)
	}, [])
	const handleLogin = async (username, password) =>
	{
		try
		{
			setLoading(true)
			const response = await fetch('http://localhost:5000/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({username, password}),
			})
			const data = await response.json()
			if (response.ok)
			{
				setIsAuthenticated(true)
				setCurrentUser({username: data.username, token: data.token})
				localStorage.setItem('token', data.token)
				localStorage.setItem('user', JSON.stringify({username: data.username}))
				alert(data.message)
			} else
			{
				alert(data.message || 'Login failed')
				setIsAuthenticated(false)
				setCurrentUser(null)
				localStorage.removeItem('token')
				localStorage.removeItem('user')
			}
		} catch (error)
		{
			console.error('Login request failed:', error)
			alert('Network error or server unavailable. Please try again.')
		} finally
		{
			setLoading(false)
		}
	}
	const handleLogout = () =>
	{
		setIsAuthenticated(false)
		setCurrentUser(null)
		localStorage.removeItem('token')
		localStorage.removeItem('user')
		alert('You have been logged out.')
	}
	if (loading)
	{
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
				<div className="text-xl text-gray-700">Loading...</div>
			</div>
		)
	}
	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
			<div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl border border-gray-200">
				{}
				{!isAuthenticated ? (
					<LoginPage onLogin={handleLogin} />
				) : (
					<>
						{}
						<div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
							<h2 className="text-2xl font-bold text-gray-800">
								Welcome, {currentUser?.username || 'Guest'}!
							</h2>
							<button
								onClick={handleLogout}
								className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-lg shadow transition duration-200 ease-in-out transform hover:scale-105"
							>
								Logout
							</button>
						</div>
						{}
						<HomePage token={currentUser?.token} />
					</>
				)}
			</div>
		</div>
	)
}
const LoginPage = ({onLogin}) =>
{
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [isRegistering, setIsRegistering] = useState(false)
	const handleSubmit = async (e) =>
	{
		e.preventDefault()
		if (isRegistering)
		{
			try
			{
				const response = await fetch('http://localhost:5000/api/auth/register', {
					method: 'POST',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({username, password}),
				})
				const data = await response.json()
				if (response.ok)
				{
					alert(data.message + '. Please login now.')
					setIsRegistering(false)
				} else
				{
					alert(data.message || 'Registration failed.')
				}
			} catch (error)
			{
				console.error('Registration request failed:', error)
				alert('Network error or server unavailable. Please try again.')
			}
		} else
		{
			onLogin(username, password)
		}
	}
	return (
		<div className="flex flex-col items-center">
			<h2 className="text-3xl font-extrabold text-gray-900 mb-6">
				Inventory {isRegistering ? 'Registration' : 'Login'}
			</h2>
			<form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
				<div>
					<label htmlFor="username" className="block text-sm font-medium text-gray-700 sr-only">
						Username
					</label>
					<input
						id="username"
						name="username"
						type="text"
						required
						className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-lg transition duration-150 ease-in-out"
						placeholder="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>
				<div>
					<label htmlFor="password" className="block text-sm font-medium text-gray-700 sr-only">
						Password
					</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-lg transition duration-150 ease-in-out"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<div>
					<button
						type="submit"
						className="group relative w-full flex justify-center py-3 px-5 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:scale-105 shadow-md"
					>
						{isRegistering ? 'Register' : 'Login'}
					</button>
				</div>
				<p className="mt-2 text-center text-sm text-gray-600">
					{isRegistering ? (
						<>
							Already have an account?{' '}
							<button
								type="button"
								onClick={() => setIsRegistering(false)}
								className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
							>
								Login
							</button>
						</>
					) : (
						<>
							Don't have an account?{' '}
							<button
								type="button"
								onClick={() => setIsRegistering(true)}
								className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
							>
								Register
							</button>
						</>
					)}
				</p>
			</form>
		</div>
	)
}
const HomePage = ({token}) =>
{
	const [inventoryItems, setInventoryItems] = useState([])
	const [newItemName, setNewItemName] = useState('')
	const [newItemQuantity, setNewItemQuantity] = useState('')
	const [newItemPrice, setNewItemPrice] = useState('')
	const [editingItem, setEditingItem] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const fetchInventory = useCallback(async () =>
	{
		setLoading(true)
		setError(null)
		try
		{
			const response = await fetch('http://localhost:5000/api/inventory', {
				headers: {
					'Authorization': `Bearer ${token}`,
				},
			})
			const data = await response.json()

			if (response.ok)
			{
				setInventoryItems(data)
			} else
			{
				setError(data.message || 'Failed to fetch inventory.')
			}
		} catch (err)
		{
			console.error('Error fetching inventory:', err)
			setError('Network error or server unavailable.')
		} finally
		{
			setLoading(false)
		}
	}, [token])
	useEffect(() =>
	{
		if (token)
		{
			fetchInventory()
		}
	}, [token, fetchInventory])
	const handleAddItem = async (e) =>
	{
		e.preventDefault()
		if (!newItemName || !newItemQuantity || !newItemPrice)
		{
			alert('Please fill in all fields for the new item.')
			return
		}
		try
		{
			const response = await fetch('http://localhost:5000/api/inventory', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify({
					name: newItemName,
					quantity: parseInt(newItemQuantity),
					price: parseFloat(newItemPrice),
				}),
			})
			const data = await response.json()
			if (response.ok)
			{
				alert('Item added successfully!')
				fetchInventory()
				setNewItemName('')
				setNewItemQuantity('')
				setNewItemPrice('')
			} else
			{
				alert(data.message || 'Failed to add item.')
			}
		} catch (err)
		{
			console.error('Error adding item:', err)
			alert('Network error or server unavailable.')
		}
	}
	const startEditing = (item) =>
	{
		setEditingItem({...item})
	}
	const handleUpdateItem = async (e) =>
	{
		e.preventDefault()
		if (!editingItem.name || !editingItem.quantity || !editingItem.price)
		{
			alert('Please fill in all fields for the item being edited.')
			return
		}
		try
		{
			const response = await fetch(`http://localhost:5000/api/inventory/${editingItem._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify({
					name: editingItem.name,
					quantity: parseInt(editingItem.quantity),
					price: parseFloat(editingItem.price),
				}),
			})
			const data = await response.json()
			if (response.ok)
			{
				alert('Item updated successfully!')
				fetchInventory()
				setEditingItem(null)
			} else
			{
				alert(data.message || 'Failed to update item.')
			}
		} catch (err)
		{
			console.error('Error updating item:', err)
			alert('Network error or server unavailable.')
		}
	}
	const handleDeleteItem = async (id) =>
	{
		if (window.confirm('Are you sure you want to delete this item?'))
		{
			try
			{
				const response = await fetch(`http://localhost:5000/api/inventory/${id}`, {
					method: 'DELETE',
					headers: {
						'Authorization': `Bearer ${token}`,
					},
				})
				const data = await response.json()
				if (response.ok)
				{
					alert('Item deleted successfully!')
					fetchInventory()
				} else
				{
					alert(data.message || 'Failed to delete item.')
				}
			} catch (err)
			{
				console.error('Error deleting item:', err)
				alert('Network error or server unavailable.')
			}
		}
	}
	return (
		<div>
			<h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Inventory Management</h2>
			{}
			<div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
				<h3 className="text-2xl font-semibold text-blue-800 mb-4">Add New Item</h3>
				<form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
					<div>
						<label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
							Item Name
						</label>
						<input
							type="text"
							id="itemName"
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base px-3 py-2"
							value={newItemName}
							onChange={(e) => setNewItemName(e.target.value)}
							placeholder="e.g., Monitor"
							required
						/>
					</div>
					<div>
						<label htmlFor="itemQuantity" className="block text-sm font-medium text-gray-700">
							Quantity
						</label>
						<input
							type="number"
							id="itemQuantity"
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base px-3 py-2"
							value={newItemQuantity}
							onChange={(e) => setNewItemQuantity(e.target.value)}
							placeholder="e.g., 20"
							required
						/>
					</div>
					<div>
						<label htmlFor="itemPrice" className="block text-sm font-medium text-gray-700">
							Price ($)
						</label>
						<input
							type="number"
							id="itemPrice"
							step="0.01"
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base px-3 py-2"
							value={newItemPrice}
							onChange={(e) => setNewItemPrice(e.target.value)}
							placeholder="e.g., 299.99"
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg shadow transition duration-200 ease-in-out transform hover:scale-105"
					>
						Add Item
					</button>
				</form>
			</div>
			{/* Inventory List */}
			<h3 className="text-2xl font-semibold text-gray-800 mb-4">Current Inventory</h3>
			{loading ? (
				<p className="text-gray-600 text-center py-4">Loading inventory...</p>
			) : error ? (
				<p className="text-red-600 text-center py-4">Error: {error}</p>
			) : inventoryItems.length === 0 ? (
				<p className="text-gray-600 text-center py-4">No inventory items yet. Add some above!</p>
			) : (
				<div className="overflow-x-auto rounded-lg shadow border border-gray-200">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
									ID
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Name
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Quantity
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Price
								</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{inventoryItems.map((item) => (
								<tr key={item._id}> {}
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{item._id}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
										{item.name}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
										{item.quantity}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
										${item.price.toFixed(2)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<button
											onClick={() => startEditing(item)}
											className="text-indigo-600 hover:text-indigo-900 mr-4 font-semibold hover:underline"
										>
											Edit
										</button>
										<button
											onClick={() => handleDeleteItem(item._id)}
											className="text-red-600 hover:text-red-900 font-semibold hover:underline"
										>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{}
			{editingItem && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg p-8 shadow-xl w-full max-w-lg border border-gray-300">
						<h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Edit Item</h3>
						<form onSubmit={handleUpdateItem} className="space-y-5">
							<div>
								<label htmlFor="editItemName" className="block text-sm font-medium text-gray-700">
									Item Name
								</label>
								<input
									type="text"
									id="editItemName"
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base px-3 py-2"
									value={editingItem.name}
									onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
									required
								/>
							</div>
							<div>
								<label htmlFor="editItemQuantity" className="block text-sm font-medium text-gray-700">
									Quantity
								</label>
								<input
									type="number"
									id="editItemQuantity"
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base px-3 py-2"
									value={editingItem.quantity}
									onChange={(e) => setEditingItem({...editingItem, quantity: parseInt(e.target.value)})}
									required
								/>
							</div>
							<div>
								<label htmlFor="editItemPrice" className="block text-sm font-medium text-gray-700">
									Price ($)
								</label>
								<input
									type="number"
									id="editItemPrice"
									step="0.01"
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base px-3 py-2"
									value={editingItem.price}
									onChange={(e) => setEditingItem({...editingItem, price: parseFloat(e.target.value)})}
									required
								/>
							</div>
							<div className="flex justify-end space-x-4 pt-4">
								<button
									type="button"
									onClick={() => setEditingItem(null)}
									className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-5 rounded-lg shadow transition duration-200 ease-in-out transform hover:scale-105"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow transition duration-200 ease-in-out transform hover:scale-105"
								>
									Save Changes
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	)
}
export default App