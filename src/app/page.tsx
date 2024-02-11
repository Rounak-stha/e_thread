'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import UsernameDialog from '@/components/UsernameDialog'

import { startThread } from '@/lib/thread'
import Textarea from '@/components/Textarea'
import useAuthor from '@/hooks/author'
import Spinner from '@/components/Icons/Spinner'

export default function Home() {
	const [sending, setSending] = useState(false)
	const [showNameModal, setShowNameModal] = useState(false)
	const [text, setText] = useState('')
	const [author, setAuthor] = useAuthor()

	const onSubmit = () => {
		if (!author) {
			setShowNameModal(true)
			return
		}
		if (!text) return

		setSending(true)

		startThread(text, author)
			.then((url) => {
				// https://github.com/vercel/next.js/discussions/49465#discussioncomment-6777067
				const a = document.createElement('a')
				a.href = `/thread${url}`
				a.click()
			})
			.catch((e) => {
				console.log(e)
				alert('An Error Occoured')
			})
			.finally(() => setSending(false))
	}

	const onNameSave = (name: string) => {
		setAuthor(name)
		setShowNameModal(false)
	}

	return (
		<main className='flex flex-col px-2 h-screen w-full items-center justify-center'>
			<p className='text-2xl sm:text-3xl mb-8 font-semibold text-center'>Welcome to Encrypted Thread</p>
			<div className='w-3/4 mb-8'>
				<Textarea
					value={text}
					setValue={setText}
					className='min-h-[100px] p-2 '
					placeholder='Start writting...'
				/>
			</div>
			<Button className='w-44' disabled={sending} onClick={onSubmit}>
				{sending ? <Spinner /> : 'Start a new thread'}
			</Button>
			{showNameModal && <UsernameDialog onSave={onNameSave} onClose={() => setShowNameModal(false)} />}
		</main>
	)
}
