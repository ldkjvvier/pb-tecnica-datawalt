'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
	Container,
	TextField,
	Button,
	Typography,
	Box,
	Paper,
} from '@mui/material'

export default function NewPost() {
	const router = useRouter()
	const [titulo, setTitulo] = useState('')
	const [contenido, setContenido] = useState('')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		const res = await fetch('/api/posts', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				title: titulo,
				content: contenido,
			}),
		})

		if (res.ok) router.push('/')
	}

	return (
		<Container maxWidth="sm" sx={{ mt: 6 }}>
			<Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
				<Typography variant="h4" gutterBottom>
					Create New Post
				</Typography>

				<Box component="form" onSubmit={handleSubmit}>
					<TextField
						fullWidth
						label="Title"
						value={titulo}
						onChange={(e) => setTitulo(e.target.value)}
						required
						sx={{ mb: 3 }}
					/>
					<TextField
						fullWidth
						label="Content"
						value={contenido}
						onChange={(e) => setContenido(e.target.value)}
						required
						multiline
						rows={5}
						sx={{ mb: 3 }}
					/>
					<Button
						type="submit"
						variant="contained"
						fullWidth
						size="large"
					>
						Submit
					</Button>
				</Box>
			</Paper>
		</Container>
	)
}
