import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import Textarea from '@/components/Textarea'
import UsernameDialog from '@/components/UsernameDialog'

import useAuthor from '@/hooks/author'
import { addToThread } from '@/lib/thread'
import useHash from '@/hooks/hash'
import { MAX_POST_LENGTH, messages } from '@/app/constants'
import UpdateContentDiaog from './UpdateContentDialog'
import Spinner from './Icons/Spinner'

type Props = { id: string }

export default function ThreadForm({ id }: Props) {
	const [loading, setLoading] = useState(false)
	const [showNameModal, setShowNameModal] = useState(false)
	const [outdatedContent, setOutdatedContent] = useState(false)
	const [text, setText] = useState('')
	const router = useRouter()

	const hash = useHash()
	const [author, setAuthor] = useAuthor()

	const onSubmit = () => {
		if (!author) {
			setShowNameModal(true)
			return
		}
		if (!text || text.length > MAX_POST_LENGTH) return
		if (!hash) {
			return alert("You shouldn't be here")
		}
		setLoading(true)

		addToThread(id, hash, { text, author })
			.then((params) => {
				router.push(`/thread${params}`)
			})
			.catch((e) => {
				if (e.message === messages.OUTDATED_CONTENT) {
					setOutdatedContent(true)
				}
				if (e.message === messages.THREAD_LIMIT_REACHED) {
					alert('Thread Limit Reached')
				} else {
					console.log(e)
					alert('An Error Occoured')
				}
			})
			.finally(() => {
				setLoading(false)
				setText('')
			})
	}

	const onNameSave = (author: string) => {
		setAuthor(author)
		setShowNameModal(false)
	}

	return (
		<>
			<div className='border-t flex items-center gap-2 p-4'>
				<Textarea
					value={text}
					setValue={setText}
					className='flex-1 min-h-[50px]'
					placeholder='Write your reply'
				/>
				<Button className='w-20' disabled={loading} onClick={onSubmit}>
					{loading ? <Spinner /> : 'Send'}
				</Button>
			</div>
			{showNameModal && <UsernameDialog onSave={onNameSave} onClose={() => setShowNameModal(false)} />}
			{outdatedContent && <UpdateContentDiaog onClose={() => setOutdatedContent(false)} />}
		</>
	)
}
