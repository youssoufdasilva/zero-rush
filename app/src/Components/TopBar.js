import React, {useState} from 'react';

const TopBar = (props) => {
	const {
		// back,
		toggleHint,
		showingHint,
		showingObjective,
		toggleObjective,
		answers,
		totalSolutions,
	} = props

	let my_answers = answers || { has_valid_ans: false }

	const [showLowestSolution, setShowLowestSolution] = useState(false)
	const [showHighestSolution, setShowHighestSolution] = useState(false)

	return (
		<div className='w-full'>
			<div className='w-full bg-purple-700 text-white rounded-b shadow-lg flex justify-between items-center p-2'>
				{/* Navbar */}
				<button
					onClick={() => {
						// let confirm_response = window.confirm('Going Back?')
						// if (confirm_response) back()
						// back()
						window.location.reload(false)
					}}
					className='inline-block w-24 py-1 rounded bg-purple-500 text-white font-bold'
				>
					Back
				</button>

				<div className='flex flex-col justify-start items-center gap-x-2 w-full h-full'>
					<p className='text-2xl'>ZERO RUSH</p>
					<div className={showingObjective ? 'visible text-xs' : 'invisible'}>
						<div
							className={`w-full flex flex-row flex-wrap justify-center items-center p-1 gap-1 ${
								showingHint ? 'opacity-100' : 'opacity-50'
							}`}
						>
							<span className='bg-blue-800 py-1 px-3 text-white font-bold rounded-lg text-center cursor-pointer'>
								<p
									onClick={() => {
										if (totalSolutions < 2) {
											alert('You need at least 2 tries...')
										} else {
											let confirm_response = window.confirm(
												showLowestSolution ? 'Hide Solution?' : 'Show Solution?'
											)
											if (confirm_response)
												setShowLowestSolution(!showLowestSolution)
										}
									}}
								>
									Lowest:{' '}
									{my_answers.has_valid_ans ? my_answers.sunset.result : '0'}
								</p>
								{showLowestSolution
									? my_answers.has_valid_ans
										? my_answers.sunset.answer
												.toString()
												.substring(
													1,
													my_answers.sunset.answer.toString().length
												)
										: '0'
									: null}
							</span>
							<span className='bg-green-800 py-1 px-3 text-white font-bold rounded-lg text-center cursor-pointer'>
								<p
									onClick={() => {
										if (totalSolutions < 2) {
											alert('You need at least 2 tries...')
										} else {
											let confirm_response = window.confirm(
												showHighestSolution
													? 'Hide Solution?'
													: 'Show Solution?'
											)
											if (confirm_response)
												setShowHighestSolution(!showHighestSolution)
										}
									}}
								>
									Highest:
									{my_answers.has_valid_ans ? my_answers.sunrise.result : '0'}
								</p>
								{showHighestSolution
									? my_answers.has_valid_ans
										? my_answers.sunrise.answer
												.toString()
												.substring(
													1,
													my_answers.sunrise.answer.toString().length
												)
										: '0'
									: null}
							</span>
						</div>
					</div>
				</div>
				<div className='w-24 flex flex-col'>
					<button
						onClick={() => {
							toggleObjective()
						}}
						className={`inline-block py-1 w-full m-1 rounded bg-purple-500 text-white font-bold ${
							showingObjective ? 'opacity-100' : 'opacity-50'
						}`}
					>
						{/* {showingObjective ? 'Hide Goal' : 'Show Goal'} */}
						Goal
					</button>
					<button
						onClick={() => {
							toggleHint()
						}}
						className={`inline-block py-1 w-full m-1 rounded bg-purple-500 text-white font-bold ${
							showingHint ? 'opacity-100' : 'opacity-50'
						}`}
					>
						{/* {showingHint ? 'Hide Hint' : 'Show Hint'} */}
						Hint
					</button>
				</div>
			</div>
		</div>
	)
}

export default TopBar;