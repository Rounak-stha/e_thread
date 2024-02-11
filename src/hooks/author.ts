import { useEffect, useState } from 'react'

export default function useAuthor(): [string, (author: string) => void] {
	const [author, setAuthor] = useState('')
	useEffect(() => {
		const author = localStorage.getItem('name') || ''
		setAuthor(author)
	}, [])

	const setNewAuthor = (author: string) => {
		localStorage.setItem('name', author)
		setAuthor(author)
	}

	return [author, setNewAuthor]
}
