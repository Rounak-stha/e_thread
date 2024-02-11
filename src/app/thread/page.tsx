'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { AvatarFallback, Avatar } from '@/components/ui/avatar'

import useHash from '@/hooks/hash'
import { Thread, decodeThread, revalidateThread } from '@/lib/thread'
import ThreadForm from '@/components/ThreadForm'
import Spinner from '@/components/Icons/Spinner'
import { REVALIDATION_PERIOD } from '../constants'

export default function Thread() {
	const [thread, setThread] = useState<Thread>([])
	const router = useRouter()
	const searchParams = useSearchParams()
	const hash = useHash()
	const threadId = searchParams.get('t') || ''

	const revalidate = async () => {
		try {
			const data = await revalidateThread(threadId)
			if (data.outdated) {
				router.push(`/thread${data.params}`)
			}
		} catch (e) {
			console.log(e)
			alert('An Error Occoured')
		}
	}
	useEffect(() => {
		revalidate()
		const interval = setInterval(revalidate, REVALIDATION_PERIOD)
		return () => clearInterval(interval)
	}, [])

	useEffect(() => {
		if (hash) {
			decodeThread(hash)
				.then((thread) => {
					setThread(thread)
				})
				.catch((e) => {
					console.log(e)
					alert('An Error Occoured')
				})
		} else {
			router.push('/')
		}
	}, [hash])

	return (
		<div className='w-full max-w-2xl mx-auto px-4 py-6 space-y-6'>
			{!thread.length && (
				<div className='text-center'>
					<Spinner size={50} />
				</div>
			)}
			{thread.map((t, i) => (
				<div key={i} className={`flex gap-4 ${i != 0 && 'ml-14'}`}>
					<Avatar className='w-10 h-10 border'>
						<AvatarFallback>{t.author[0]}</AvatarFallback>
					</Avatar>
					<div className='grid gap-1.5'>
						<div className='flex items-center gap-2'>
							<div className='font-semibold'>{t.author}</div>
							<div className='text-sm text-gray-500 dark:text-gray-400'>· 2h</div>
						</div>
						<div className='text-sm leading-loose text-gray-500 dark:text-gray-400'>
							<p>{t.text}</p>
						</div>
					</div>
				</div>
			))}
			<ThreadForm id={threadId} />
		</div>
	)
}
