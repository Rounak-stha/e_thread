
export function binaryToHex(data: Uint8Array) {
	return Array.prototype.map
		.call(data, function (byte) {
			return ('0' + (byte & 0xff).toString(16)).slice(-2)
		})
		.join('')
}

export async function binaryToBase64(data: Uint8Array): Promise<string> {
	// Create a Blob from the Uint8Array
	return new Promise((res) => {
		const blob = new Blob([data])

		// Use FileReader to read the Blob as Base64
		const fileReader = new FileReader()
		fileReader.onload = function () {
			res((fileReader.result as string).split(',')[1])
		}
		fileReader.readAsDataURL(blob)
	})
}

export async function base64ToBinary(data: string) {
	// Decode the Base64 string
	let binaryString = atob(data)

	// Convert the binary string into a Uint8Array
	let bytes = new Uint8Array(binaryString.length)

	for (let i = 0; i < binaryString.length; i++) {
		bytes[i] = binaryString.charCodeAt(i)
	}

	return bytes
}

export async function generateKey() {
	return await window.crypto.subtle.generateKey({ name: 'AES-GCM', length: 128 }, true, ['encrypt', 'decrypt'])
}

export const encrypt = async (data: Uint8Array, key: CryptoKey) => {
	return new Uint8Array(await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv: new Uint8Array(12) }, key, data))
}

export const getSharableKey = async (key: CryptoKey) => {
	return (await window.crypto.subtle.exportKey('jwk', key)).k
}

export const getCKeyFromKeyString = async (key: string) => {
	return await window.crypto.subtle.importKey(
		'jwk',
		{
			k: key,
			alg: 'A128GCM',
			ext: true,
			key_ops: ['encrypt', 'decrypt'],
			kty: 'oct'
		},
		{ name: 'AES-GCM', length: 128 },
		false,
		['encrypt', 'decrypt']
	)
}

export const decrypt = async (data: Uint8Array, key: CryptoKey) => {
	return await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(12) }, key, data)
}

export function getHashValue() {
	return window.location.hash.slice(1)
}

export const separateHashValue = (data: string): [key: string, data: string] => {
	if (data.length < 22) throw new Error('Invalid Data')
	const key = data.slice(0, 22)
	const thread = decodeURIComponent(data.slice(22))
	return [key, thread]
}
