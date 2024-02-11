import { Textarea as STextArea } from '@/components/ui/textarea'
import { MAX_POST_LENGTH } from '@/app/constants'
import { cn } from '@/lib/utils'

type Props = {
	value: string
	setValue: (newVal: string) => void
	className?: string
	placeholder?: string
}

export default function Textarea({ value, setValue, className, placeholder }: Props) {
	return (
		<div className={className}>
			<div className='relative w-full h-full'>
				<STextArea
					value={value}
					onChange={(e) => setValue(e.target.value)}
					className='h-full rounded-lg border-2 border-gray-600 focus:border-blue-300 focus-visible:ring-transparent'
					placeholder={placeholder}
				/>
				<span
					className={`absolute bottom-3 right-3 text-xs ${
						(value.length || 0) <= MAX_POST_LENGTH ? 'text-gray-500' : 'text-red-400'
					}`}
				>
					{value.length} / {MAX_POST_LENGTH}
				</span>
			</div>
		</div>
	)
}
