'use client'

import { useEffect, useState } from 'react'
import {
	Container,
	Typography,
	Button,
	Box,
	IconButton,
	CircularProgress,
	Paper,
	Divider,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@mui/material'
import Link from 'next/link'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useRouter } from 'next/navigation'

import { Post } from '../../generated/client'
import dayjs from 'dayjs'

export default function Home() {
	const [posts, setPosts] = useState<Post[] | null>(null)
	const [openDialog, setOpenDialog] = useState(false)
	const [postToDelete, setPostToDelete] = useState<Post | null>(null)
	const [favorites, setFavorites] = useState<number[]>([])
	const router = useRouter()

	useEffect(() => {
		fetch('/api/posts')
			.then((res) => res.json())
			.then((data) => setPosts(data))
	}, [])

	useEffect(() => {
		const storedFavorites = JSON.parse(
			localStorage.getItem('favorites') || '[]'
		)
		setFavorites(storedFavorites)
	}, [])

	useEffect(() => {
		if (favorites.length > 0) {
			localStorage.setItem('favorites', JSON.stringify(favorites))
		}
	}, [favorites])

	const confirmDelete = (post: Post) => {
		setPostToDelete(post)
		setOpenDialog(true)
	}

	const handleDeleteConfirmed = async () => {
		if (!postToDelete) return
		await fetch(`/api/posts/${postToDelete.id}`, { method: 'DELETE' })
		setPosts(
			(prev) =>
				prev?.filter((post) => post.id !== postToDelete.id) ?? null
		)
		setPostToDelete(null)
		setOpenDialog(false)
	}

	const handleDialogClose = () => {
		setOpenDialog(false)
		setPostToDelete(null)
	}

	const handleFavorite = (id: number) => {
		setFavorites((prevFavorites) =>
			prevFavorites.includes(id)
				? prevFavorites.filter((favId) => favId !== id)
				: [...prevFavorites, id]
		)
	}

	const handleLogout = async () => {
		await fetch('/api/logout', { method: 'POST' })
		router.push('/')
	}

	if (posts === null) {
		return (
			<Container maxWidth="md" sx={{ mt: 6, textAlign: 'center' }}>
				<CircularProgress />
			</Container>
		)
	}

	return (
		<Container maxWidth="md" sx={{ mt: 6 }}>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				mb={4}
			>
				<Typography variant="h4" fontWeight="bold">
					Bulletin Board
				</Typography>
				<Box display="flex" gap={2}>
					<Button variant="contained" component={Link} href="/new">
						New Post
					</Button>
					<Button
						variant="outlined"
						color="secondary"
						onClick={handleLogout}
					>
						Logout
					</Button>
				</Box>
			</Box>

			{posts.length === 0 ? (
				<Typography>No posts yet.</Typography>
			) : (
				posts.map((post) => (
					<Paper
						key={post.id}
						elevation={2}
						sx={{
							mb: 3,
							p: 3,
							borderRadius: 3,
							position: 'relative',
						}}
					>
						<Typography variant="h6" gutterBottom>
							{post.title}
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ mb: 1 }}
						>
							{dayjs(post.createdAt).format('YYYY-MM-DD HH:mm')}
						</Typography>
						<Divider sx={{ mb: 2 }} />
						<Typography variant="body1">{post.content}</Typography>

						<Box position="absolute" top={16} right={16}>
							<IconButton
								onClick={() => handleFavorite(post.id)}
								aria-label="favorite"
								size="small"
							>
								{favorites.includes(post.id) ? (
									<FavoriteIcon fontSize="small" color="primary" />
								) : (
									<FavoriteBorderIcon fontSize="small" />
								)}
							</IconButton>
							<IconButton
								component={Link}
								href={`/edit/${post.id}`}
								aria-label="edit"
								size="small"
							>
								<EditIcon fontSize="small" />
							</IconButton>
							<IconButton
								onClick={() => confirmDelete(post)}
								aria-label="delete"
								size="small"
							>
								<DeleteIcon fontSize="small" />
							</IconButton>
						</Box>
					</Paper>
				))
			)}

			<Dialog open={openDialog} onClose={handleDialogClose}>
				<DialogTitle>Confirm Delete</DialogTitle>
				<DialogContent>
					<Typography>
						Are you sure you want to delete{' '}
						<strong>{postToDelete?.title}</strong>?
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogClose}>Cancel</Button>
					<Button
						onClick={handleDeleteConfirmed}
						variant="contained"
						color="error"
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	)
}
