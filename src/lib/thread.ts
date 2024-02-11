import pako from 'pako'
import {
	base64ToBinary,
	binaryToBase64,
	decrypt,
	encrypt,
	generateKey,
	getCKeyFromKeyString,
	getHashValue,
	getSharableKey,
	separateHashValue
} from './utils'
import { messages } from '@/app/constants'

export type ThreadData = {
	text: string
	author: string
	createdAt: string // Date String
}

export type Thread = ThreadData[]

export async function startThread(text: string, author: string) {
	const date = new Date()
	let id: number
	const threadData: ThreadData[] = [
		{
			text,
			author,
			createdAt: date.toISOString()
		}
	]
	const [encoded, key] = await encodeThread(threadData)
	const res = await fetch('/api/thread/create', {
		method: 'POST',
		body: JSON.stringify({ data: encoded, date: date.getTime() })
	})

	if (res.status !== 200) {
		return ''
	} else {
		const data = await res.json()
		id = data.id
		return `?t=${id}#${encodeURIComponent(key + encoded)}`
	}
}

export async function encodeThread(data: ThreadData[], existingKey?: string): Promise<[string, string]> {
	const cryptoKey = existingKey ? await getCKeyFromKeyString(existingKey) : await generateKey()
	const key = existingKey ? existingKey : await getSharableKey(cryptoKey)
	if (!key) throw new Error('Error Generating Key')
	const compressed = pako.deflate(JSON.stringify(data))
	const encrypted = await encrypt(compressed, cryptoKey)
	const base64Encoded = await binaryToBase64(encrypted)
	return [base64Encoded, key]
}

export async function decodeThread(data: string) {
	const [key, thread] = separateHashValue(data)
	const cryptoKey = await getCKeyFromKeyString(key)
	const encryptedData = await base64ToBinary(thread)
	const decryptedData = await decrypt(encryptedData, cryptoKey)
	const decoder = new TextDecoder()
	const decompressed = JSON.parse(decoder.decode(pako.inflate(decryptedData))) as Thread

	return decompressed
}

export async function revalidateThread(id: string) {
	const hashValue = getHashValue()
	const threadData = await decodeThread(hashValue)
	const [key] = separateHashValue(hashValue)

	const lastUpdated = threadData[threadData.length - 1].createdAt

	const res = await fetch('/api/thread/revalidate', {
		method: 'POST',
		body: JSON.stringify({ id, lastUpdated })
	})

	if (res.status == 200) {
		const data = await res.json()
		if (data.message === messages.OUTDATED_CONTENT) {
			console.log('Outdated Content')
			const thread = data.thread

			return {
				outdated: true,
				params: `?t=${id}#${encodeURIComponent(key + thread)}`
			}
		}
		return {
			outdated: false,
			params: ''
		}
	} else {
		throw new Error('Unknown Error')
	}
}

export async function addToThread(id: string, hashValue: string, newData: { text: string; author: string }) {
	const date = new Date()
	const threadData = await decodeThread(hashValue)
	const [key] = separateHashValue(hashValue)

	const lastUpdated = threadData[threadData.length - 1].createdAt

	threadData.push({
		text: newData.text,
		author: newData.author,
		createdAt: date.toISOString()
	})

	// Should we generate new key or use the old one?

	const [encoded] = await encodeThread(threadData, key)

	const res = await fetch('/api/thread/update', {
		method: 'POST',
		body: JSON.stringify({ id, data: encoded, date: date.getTime(), lastUpdated })
	})

	if (res.status !== 200) {
		if (res.status === 409) {
			const data = await res.json()
			if (data.message === 'Outdated Content') {
				throw new Error('Outdated Content')
			}
		}
		throw new Error('Network Error')
	}

	return `?t=${id}#${encodeURIComponent(key + encoded)}`
}

export async function getThread(id: string): Promise<string> {
	const res = await fetch(`/api/thread/${id}`, { cache: 'no-store' })
	const thread = await res.json()
	return thread.data
}

export async function updateThread(id: string) {
	const thread = await getThread(id)
	const [key] = separateHashValue(getHashValue())
	return encodeURIComponent(key + thread)
}
