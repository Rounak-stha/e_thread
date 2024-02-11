import { messages } from '@/app/constants'
import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	const body = await req.json()
	const { id, lastUpdated } = body

	const lastUpdatedOnCLient = new Date(lastUpdated).getTime().toString()

	try {
		const res = await sql`SELECT data, updated FROM e_thread WHERE id = ${id}`

		const record = res.rows[0]
		if (lastUpdatedOnCLient != record.updated) {
			return NextResponse.json({ message: messages.OUTDATED_CONTENT, thread: record.data })
		}
		return NextResponse.json({ message: 'Success' })
	} catch (e) {
		console.log(e)
		return NextResponse.json({ message: 'An Error Occoured' }, { status: 500 })
	}
}
