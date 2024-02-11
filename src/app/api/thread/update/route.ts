import { messages } from '@/app/constants'
import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	const body = await req.json()
	const { id, data, date, lastUpdated } = body

	const lastUpdatedOnCLient = new Date(lastUpdated).getTime().toString()

	try {
		const res = await sql`SELECT updated FROM e_thread WHERE id = ${id}`

		if (lastUpdatedOnCLient != res.rows[0].updated) {
			return NextResponse.json({ message: messages.OUTDATED_CONTENT }, { status: 409 })
		}
		await sql`UPDATE e_thread SET data = ${data}, updated = ${date} WHERE id = ${id} RETURNING *`

		return NextResponse.json({ message: 'Success' })
	} catch (e) {
		console.log(e)
		return NextResponse.json({ message: 'An Error Occoured' }, { status: 500 })
	}
}
