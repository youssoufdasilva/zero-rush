import React, {useState} from 'react';

const ConfirmPuzzle = (props) => {
	const { puzzle, answers, start, clear, isRushing, rushFound } = props

	const [showingStats, setShowingStats] = useState(false)
	// const [showingGoal, setShowingGoal] = useState(false)
	const [showingGoal, setShowingGoal] = useState(true)

	if (puzzle === null && isRushing === false) return null

	let status, custom_style
	if (answers !== null && answers.has_valid_ans) {
		let has_zero = answers.sunset.result === '0'
		let is_good = answers.sunrise.permutationCount === 1
		let has_float = answers.sunrise.floatDetected
		if (is_good && has_zero) {
			custom_style = `border-4 border-green-500 bg-green-800 ${
				has_float ? 'border-dotted' : 'border-solid'
			}`
			status = "Let's Go!"
		} else if (is_good) {
			custom_style = `border-4 border-purple-800 bg-green-800 ${
				has_float ? 'border-dotted' : 'border-solid'
			}`
			status = 'Decent!'
		} else if (has_zero) {
			custom_style = `border-4 border-green-500 bg-purple-800 ${
				has_float ? 'border-dotted' : 'border-solid'
			}`
			status = 'Has Zero!'
		} else {
			custom_style = `border-4 border-yellow-200 bg-purple-800 ${
				has_float ? 'border-dotted' : 'border-solid'
			}`
			status = 'Not Garbage!'
		}
	} else if (answers !== null && !answers.has_valid_ans) {
		custom_style = 'border-4 border-red-500 bg-red-800'
		status = 'Nope, Garbage!'
	}
	return (
		<div
			className={`min-w-1/2 w-1/2x px-4 rounded-xl shadow-xl text-white mx-auto my-4 ${custom_style}`}
		>
			<div
				className={
					isRushing
						? 'hidden'
						: 'flex flex-col justify-center items-center p-4 '
				}
			>
				<div
					className='text-purple-800 bg-white rounded px-2 py-1x font-bold mt-6x mb-2'
					onClick={() => setShowingGoal(!showingGoal)}
				>
					{rushFound ? (
						<p className='m-1'>Easier Puzzle Found!</p>
					) : (
						<p className='m-1'>New Random Puzzle!</p>
					)}
				</div>

				<div
					className={
						showingGoal
							? 'text-center bg-purple-100 p-1 rounded text-black mb-4'
							: 'hidden'
					}
					onClick={() => setShowingStats(!showingStats)}
				>
					<p className='border-b border-black'>
						{`#${answers ? answers.all_answers : '-'} | [↓ ${
							answers && answers.sunset ? answers.sunset.result : '-'
						},↑ ${answers && answers.sunrise ? answers.sunrise.result : '-'}]`}
					</p>

					{showingStats ? (
						<div className=''>
							<p>
								Answers:{' '}
								{`${answers ? answers.all_answers : '-'} / ${
									answers ? answers.all_permutations : '-'
								}`}
							</p>
							<p>
								Lowest:{' '}
								{`${answers && answers.sunset ? answers.sunset.result : '-'}`}
								{` (Perm #: ${
									answers && answers.sunset
										? answers.sunset.permutationCount
										: '-'
								})`}
							</p>
							<p>
								Highest:{' '}
								{`${answers && answers.sunrise ? answers.sunrise.result : '-'}`}
								{` (Perm #: ${
									answers && answers.sunrise
										? answers.sunrise.permutationCount
										: '-'
								})`}
							</p>
							<p>Status: {status}</p>
						</div>
					) : null}
				</div>
				<div>{puzzle}</div>
				{/* <div>{answers.all_answers || 'xx'}</div> */}
				<button
					className='text-purple-800 bg-white rounded px-4 py-1 font-bold mt-6'
					onClick={() => {
						answers.has_valid_ans
							? start()
							: alert('This is not a valid puzzle dude!')
					}}
				>
					Start Game
				</button>
				<button
					className='text-white px-4 py-1 text-xs mt-2'
					onClick={() => {
						clear()
					}}
				>
					Clear Puzzle
				</button>
			</div>

			<div className={isRushing ? 'block text-center m-4' : 'hidden'}>
				<p
					onClick={() => {
						alert('test')
					}}
					className={isRushing ? 'animate__animated animate__rubberBand' : ''}
				>
					Loading!
				</p>
				<p>Rush = Easier</p>
				<p className='mt-2'>Please Wait...</p>
			</div>
		</div>
	)
}

export default ConfirmPuzzle;