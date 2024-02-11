/**
 * v0 by Vercel.
 * @see https://v0.dev/t/eWPtWJ7YpfH
 */
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function Thread() {
	return (
		<div className='w-full max-w-2xl mx-auto px-4 py-6 space-y-6'>
			<div className='flex gap-4'>
				<Avatar className='w-10 h-10 border'>
					<AvatarImage alt='@shadcn' src='/placeholder-user.jpg' />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
				<div className='grid gap-1.5'>
					<div className='flex items-center gap-2'>
						<div className='font-semibold'>John Doe</div>
						<div className='text-sm text-gray-500 dark:text-gray-400'>· 2h</div>
					</div>
					<div className='text-sm leading-loose text-gray-500 dark:text-gray-400'>
						<p>
							This is a tweet thread. It includes a header with the user&apos;s profile picture, display
							name, username, and timestamp.
						</p>
					</div>
				</div>
			</div>
			<div className='flex gap-4 ml-14'>
				<Avatar className='w-10 h-10 border'>
					<AvatarImage alt='@shadcn' src='/placeholder-user.jpg' />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
				<div className='grid gap-1.5'>
					<div className='flex items-center gap-2'>
						<div className='font-semibold'>Jane Doe</div>
						<div className='text-sm text-gray-500 dark:text-gray-400'>@janedoe</div>
						<div className='text-sm text-gray-500 dark:text-gray-400'>· 1h</div>
					</div>
					<div className='text-sm leading-loose text-gray-500 dark:text-gray-400'>
						<p>This is a reply to the tweet thread.</p>
					</div>
					<div className='flex gap-2'></div>
				</div>
			</div>
			<div className='border-t p-4'>
				<form className='flex items-center gap-2'>
					<Textarea className='flex-1 min-h-[50px]' placeholder='Write your reply' />
					<Button type='submit'>Send</Button>
				</form>
			</div>
		</div>
	)
}
