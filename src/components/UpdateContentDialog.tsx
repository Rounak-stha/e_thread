import { Button } from '@/components/ui/button'
import { DialogTitle, DialogHeader, DialogFooter, DialogContent, Dialog } from '@/components/ui/dialog'
import { DialogClose } from '@radix-ui/react-dialog'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { updateThread } from '@/lib/thread'

type Props = {
	onClose: () => void
}

export default function UpdateContentDiaog({ onClose }: Props) {
	const [open, setOpen] = useState(true)
	const router = useRouter()
	const searchParams = useSearchParams()

	useEffect(() => {
		const id = searchParams.get('t') || ''
		if (id) {
			updateThread(id)
				.then((thread) => {
					router.push(`/thread?t=${id}#${thread}`)
				})
				.catch(() => {
					console.log('An Error Occured')
				})
				.finally(() => {
					onClose()
					setOpen(false)
				})
		}
	}, [])
	return (
		<Dialog open={open}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>The thread content is outdated.</DialogTitle>
				</DialogHeader>
				<div className='p-6 space-y-6'>
					Upating Contents....
					<DialogFooter>
						<DialogClose asChild>
							<Button onClick={onClose} variant='outline'>
								Close
							</Button>
						</DialogClose>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	)
}
