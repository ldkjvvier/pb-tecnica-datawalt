import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSessionUserId } from '@/lib/session' // función que tú implementas

export async function GET() {
	try {
		const userId = await getSessionUserId()
		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 })
		}

		const posts = await prisma.post.findMany({
			where: { userId },
			orderBy: { createdAt: 'desc' },
		})
		return NextResponse.json(posts)
	} catch (error) {
		console.error('Error al obtener posts:', error)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}

export async function POST(req: Request) {
	const userId = await getSessionUserId()
	if (!userId) {
		return new NextResponse('Unauthorized', { status: 401 })
	}

	const body = await req.json()
	const newPost = await prisma.post.create({
		data: {
			title: body.title,
			content: body.content,
			userId: userId,
		},
	})
	return NextResponse.json(newPost)
}
