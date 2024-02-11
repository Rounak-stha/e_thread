import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { id: string } }) {
	const id = params.id
	try {
		const res = await sql`SELECT data FROM e_thread WHERE id = ${id}`
		return NextResponse.json({ data: res.rows[0].data })
	} catch (e) {
		console.log(e)
		return NextResponse.json({ message: 'An Error Occoured' }, { status: 500 })
	}
}
