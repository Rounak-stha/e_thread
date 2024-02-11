import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	const body = await req.json()
	const { data, date } = body

	try {
		const insertedData = await sql`INSERT INTO e_thread (data, updated) VALUES (${data}, ${date}) RETURNING *`
		const { id } = insertedData.rows[0]

		return NextResponse.json({ message: 'Success', id })
	} catch (e) {
		console.log(e)
		return NextResponse.json({ message: 'An Error Occoured' }, { status: 500 })
	}
}
