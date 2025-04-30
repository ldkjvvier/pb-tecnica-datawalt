import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
	const { email, password } = await req.json()

	const user = await prisma.user.findUnique({ where: { email } })
	if (!user || !(await bcrypt.compare(password, user.password))) {
		return NextResponse.json(
			{ error: 'Invalid credentials' },
			{ status: 401 }
		)
	}

	const cookieStore = await cookies()
	cookieStore.set('userId', String(user.id), {
		httpOnly: true,
		path: '/',
	})

	return NextResponse.json({
		user: { id: user.id, email: user.email },
	})
}
