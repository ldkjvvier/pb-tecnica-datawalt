// src/app/api/posts/[id]/route.ts
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'
import { getSessionUserId } from '@/lib/session'

export async function GET(
	_: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params
		const userId = await getSessionUserId()
		if (!userId)
			return new NextResponse('Unauthorized', { status: 401 })

		const postId = Number(id)
		if (isNaN(postId))
			return new NextResponse('Invalid post ID', { status: 400 })

		const post = await prisma.post.findFirst({
			where: { id: postId, userId },
		})
		if (!post) return new NextResponse('Not found', { status: 404 })

		return NextResponse.json(post)
	} catch (error) {
		console.error('GET error:', error)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}

export async function PUT(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params
		const userId = await getSessionUserId()
		if (!userId)
			return new NextResponse('Unauthorized', { status: 401 })

		const postId = Number(id)
		if (isNaN(postId))
			return new NextResponse('Invalid post ID', { status: 400 })

		const existing = await prisma.post.findFirst({
			where: { id: postId, userId },
		})
		if (!existing)
			return new NextResponse('Post not found or forbidden', {
				status: 403,
			})

		const body = await req.json()
		const updated = await prisma.post.update({
			where: { id: postId },
			data: { title: body.title, content: body.content },
		})
		return NextResponse.json(updated)
	} catch (error) {
		console.error('PUT error:', error)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params
		const userId = await getSessionUserId()
		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 })
		}

		const postId = Number(id)
		if (isNaN(postId)) {
			return new NextResponse('Invalid post ID', { status: 400 })
		}

		const existing = await prisma.post.findFirst({
			where: { id: postId, userId },
		})

		if (!existing) {
			return new NextResponse('Post not found or forbidden', {
				status: 403,
			})
		}

		await prisma.post.delete({
			where: { id: postId },
		})

		return NextResponse.json({ ok: true })
	} catch (error) {
		console.error('DELETE error:', error)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}
