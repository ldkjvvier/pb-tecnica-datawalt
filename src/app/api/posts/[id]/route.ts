// src/app/api/posts/[id]/route.ts
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
	_: Request,
	{ params }: { params: { id: string } }
) {
	const post = await prisma.post.findUnique({
		where: { id: Number(params.id) },
	})
	return NextResponse.json(post)
}

export async function PUT(
	req: Request,
	{ params }: { params: { id: string } }
) {
	const body = await req.json()
	const updated = await prisma.post.update({
		where: { id: Number(params.id) },
		data: { title: body.title, content: body.content },
	})
	return NextResponse.json(updated)
}

export async function DELETE(
	_: Request,
	{ params }: { params: { id: string } }
) {
	await prisma.post.delete({ where: { id: Number(params.id) } })
	return NextResponse.json({ ok: true })
}
