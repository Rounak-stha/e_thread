import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const getHash = () => (typeof window !== 'undefined' ? decodeURIComponent(window.location.hash.replace('#', '')) : '')

const useHash = () => {
	const params = useParams()
	const [hash, setHash] = useState(getHash())

	useEffect(() => {
		setHash(getHash())
	}, [params])

	return hash
}

export default useHash
