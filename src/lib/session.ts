import { cookies } from 'next/headers'

export async function getSessionUserId(): Promise<number | null> {
	const cookieStore = await cookies()
	const userId = cookieStore.get('userId')?.value
	return Number(userId) ?? null
}
