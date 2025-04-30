// /app/register/page.tsx
'use client'

import { useState } from 'react'
import {
	Button,
	Container,
	TextField,
	Typography,
	Box,
	CircularProgress,
	Paper,
} from '@mui/material'
import { useRouter } from 'next/navigation'

export default function Register() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const router = useRouter()

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault()
		if (password !== confirmPassword) {
			setError('Passwords do not match')
			return
		}

		setLoading(true)
		setError('')
		try {
			const response = await fetch('/api/register', {
				method: 'POST',
				body: JSON.stringify({ email, password }),
				headers: { 'Content-Type': 'application/json' },
			})
			const data = await response.json()

			if (response.ok) {
				router.push('/')
			} else {
				setError(data.error || 'Registration failed')
			}
		} catch (err) {
			console.log(err)
			setError('An error occurred during registration')
		} finally {
			setLoading(false)
		}
	}

	return (
		<Container maxWidth="sm" sx={{ mt: 6 }}>
			<Paper elevation={3} sx={{ padding: 3 }}>
				<Typography variant="h4" gutterBottom>
					Register
				</Typography>
				<form onSubmit={handleRegister}>
					<TextField
						label="Email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						fullWidth
						required
						sx={{ mb: 2 }}
					/>
					<TextField
						label="Password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						fullWidth
						required
						sx={{ mb: 2 }}
					/>
					<TextField
						label="Confirm Password"
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						fullWidth
						required
						sx={{ mb: 2 }}
					/>
					{error && <Typography color="error">{error}</Typography>}
					<Box
						sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
					>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							disabled={loading}
						>
							{loading ? <CircularProgress size={24} /> : 'Register'}
						</Button>
					</Box>
				</form>
			</Paper>
		</Container>
	)
}
