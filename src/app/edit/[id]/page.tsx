'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
	TextField,
	Button,
	Container,
	Typography,
	Box,
	Paper,
} from '@mui/material'

export default function EditPostPage() {
	const router = useRouter()
	const { id } = useParams()
	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')

	useEffect(() => {
		fetch(`/api/posts/${id}`)
			.then((res) => res.json())
			.then((post) => {
				setTitle(post.title)
				setContent(post.content)
			})
	}, [id])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		await fetch(`/api/posts/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title, content }),
		})
		router.push('/')
	}

	return (
		<Container maxWidth="sm" sx={{ mt: 4 }}>
			<Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
				<Typography variant="h5" mb={2}>
					Edit Post
				</Typography>
				<Box component="form" onSubmit={handleSubmit}>
					<TextField
						fullWidth
						label="Title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
						sx={{ mb: 2 }}
					/>
					<TextField
						fullWidth
						multiline
						rows={4}
						label="Content"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						required
						sx={{ mb: 2 }}
					/>
					<Button type="submit" variant="contained">
						Save Changes
					</Button>
				</Box>
			</Paper>
		</Container>
	)
}
