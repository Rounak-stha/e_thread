import { Button } from '@/components/ui/button'
import { DialogTrigger, DialogTitle, DialogHeader, DialogFooter, DialogContent, Dialog } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { DialogClose } from '@radix-ui/react-dialog'
import { useRef } from 'react'

type Props = {
	onSave: (name: string) => void
	onClose: () => void
}

export default function UsernameDialog({ onSave, onClose }: Props) {
	const nameInputRef = useRef<HTMLInputElement>(null)

	const onSaveName = () => {
		if (nameInputRef.current) {
			const name = nameInputRef.current.value
			if (name) {
				onSave(name)
			}
		}
	}

	return (
		<Dialog defaultOpen>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Enter your name</DialogTitle>
				</DialogHeader>
				<div className='p-6 space-y-6'>
					<div className='space-y-2'>
						<Label htmlFor='name'>Name</Label>
						<Input ref={nameInputRef} id='name' placeholder='Enter your name' />
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button onClick={onClose} variant='outline'>
								Close
							</Button>
						</DialogClose>
						<Button onClick={onSaveName}>Save</Button>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	)
}
