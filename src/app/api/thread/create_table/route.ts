import { sql } from '@vercel/postgres'

export async function GET() {
	const data = await sql`CREATE TABLE e_thread(
			id SERIAL PRIMARY KEY,
			data VARCHAR(1950),
			created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated VARCHAR(20)
		);`
}
