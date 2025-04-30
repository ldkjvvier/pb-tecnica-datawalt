import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
	const cookieStore = await cookies()
	const userId = cookieStore.get('userId')?.value

	if (!userId) {
		return NextResponse.json({ isLoggedIn: false })
	}

	return NextResponse.json({ isLoggedIn: true })
}
