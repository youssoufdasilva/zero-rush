import React, { useState } from 'react'
import { solvePuzzle } from './GameHelpers'

const GameScreen = (props) => {
	const { puzzle, answers, visible, back } = props

	// const currentHand = visible && puzzle !== null ? puzzle.split(',') : []

	const [currentAttempt, setCurrentAttempt] = useState([])
	const [currentSolution, setCurrentSolution] = useState({ answer: '-' })
	const [allSolutions, setAllSolutions] = useState([])
	const [showingHint, setShowingHint] = useState(false)

	if (puzzle === null) {
		back()

		// if (!visible && currentAttempt !== []) setCurrentAttempt([])
		if (visible) window.location.reload(false)

		return null
	}

	const moveToAttempt = (card) => {
		console.log('Moving: ', card)

		let temp_attempt = currentAttempt
		temp_attempt.push(card)
		setCurrentAttempt(temp_attempt)

		// if (temp_attempt.length > 1) {
		let temp_solution = solvePuzzle(temp_attempt)
		setCurrentSolution(temp_solution)
		console.log('SOLUTION = ', temp_solution)

		if (temp_attempt.length === puzzle.split(',').length) {
			let temp_all_sols = allSolutions
			let temp_att_string = temp_attempt.toString()
			temp_all_sols.push({
				attempt: temp_att_string.substring(1, temp_att_string.length),
				solution: Math.round(temp_solution.answer * 100) / 100,
			})
			setAllSolutions(temp_all_sols)
			setCurrentAttempt([])
			setCurrentSolution({ answer: '-' })

			if (
				temp_solution.answer.toString() === answers.sunset.result ||
				temp_solution.answer.toString() === answers.sunrise.result
			) {
				alert('Congratulations')
			}
		}
		// }
	}

	const moveToHand = (card) => {
		let temp_attempt = currentAttempt

		let card_index = temp_attempt.indexOf(card)

		console.log(`Removing Card ${card} At Index ${card_index}`)

		console.log('Before Splice Attempt ', temp_attempt)
		temp_attempt.splice(card_index, 1)
		// temp_hand.push(card)
		console.log('After Splice Attempt ', temp_attempt)

		setCurrentAttempt(temp_attempt)

		let temp_solution = solvePuzzle(temp_attempt)
		setCurrentSolution(temp_solution)
		console.log('SOLUTION = ', temp_solution)
	}

	return (
		<div
			style={visible ? { display: 'flex' } : { display: 'none' }}
			className='h-screen flex-col justify-between items-center font-bold w-full bg-purple-200'
		>
			<TopBar
				back={() => {
					setAllSolutions([])
					back()
				}}
				showingHint={showingHint}
				toggleHint={() => {
					// alert('pause game')
					setShowingHint(!showingHint)
				}}
				answers={answers}
			/>

			<div
				style={
					allSolutions.length === 10 ? { display: 'none' } : { display: 'flex' }
				}
				className={` gap-3 mb-4 border-white`}
			>
				{/* Attempt */}
				{currentAttempt !== []
					? currentAttempt.map((card, i) => {
							return (
								<div
									key={`${card}-${i}`}
									onClick={() => moveToHand(card)}
									className='bg-white p-4 rounded border-2'
								>
									{card}
								</div>
							)
					  })
					: null}
			</div>

			<div className='flex flex-col'>
				<div
					style={
						allSolutions.length === 10
							? { display: 'none' }
							: { display: 'flex' }
					}
					className=' flex-col flex-wrap items-center gap-4'
				>
					<p className='text-2xl'>Solution: {currentSolution.answer}</p>
					<button
						className={
							currentAttempt.length > 0
								? 'bg-purple-800 px-2 m-1 rounded font-bold text-white'
								: 'hidden'
						}
						onClick={() => {
							setCurrentAttempt([])
							setCurrentSolution({ answer: '-' })
							// window.location.reload(false)
						}}
					>
						Clear
					</button>
				</div>
				<div
					className={
						allSolutions.length === 0
							? 'hidden'
							: 'flex flex-col flex-wrap items-center gap-4 p-4 border border-black rounded mx-4 text-xs'
					}
				>
					<p>Total Solutions {allSolutions.length}</p>
					<ol>
						{allSolutions.map((this_solution, i) => {
							const valid =
								this_solution.solution.toString() === answers.sunset.result ||
								this_solution.solution.toString() === answers.sunrise.result

							const invalid =
								this_solution.solution.toString().charAt(0) === '-' ||
								this_solution.solution.toString().split('.').length > 1

							return (
								<li
									key={i}
									className={
										valid ? 'text-green-500' : invalid ? 'text-red-500' : null
									}
								>
									{this_solution.attempt} = {this_solution.solution}
								</li>
							)
						})}
					</ol>
				</div>
			</div>

			{allSolutions.length === 10 ? (
				<div className='mb-8 text-center'>
					<p>The Solution</p>
					<p>
						{' '}
						{`Sunset: ${answers.sunset.answer.toString()} => ${
							answers.sunset.result
						}`}
					</p>
					<p>
						{' '}
						{`Sunrise: ${answers.sunrise.answer.toString()} => ${
							answers.sunrise.result
						}`}
					</p>

					<button
						className='bg-purple-800 p-2 my-4 rounded font-bold text-white'
						onClick={() => {
							setAllSolutions([])
							back()
						}}
					>
						Return
					</button>
				</div>
			) : (
				<div className='flex gap-2 mb-16 border-white'>
					{/* Hand */}
					{puzzle !== null
						? puzzle.split(',').map((card, i) => {
								let card_available = currentAttempt.indexOf(card) === -1

								let sunset_hint =
									showingHint && card === answers.sunset.answer[0]
								let sunrise_hint =
									showingHint && card === answers.sunrise.answer[0]

								return (
									<div
										key={`${card}-${i}`}
										onClick={() => {
											if (card_available) {
												moveToAttempt(card)
											}
										}}
										className={`${
											card_available ? 'bg-white' : 'bg-gray-400'
										} p-3 rounded border-4 ${
											sunrise_hint
												? 'border-green-400'
												: sunset_hint
												? 'border-blue-400'
												: 'border-white'
										}`}
									>
										{card}
									</div>
								)
						  })
						: null}
				</div>
			)}
		</div>
	)
}

const TopBar = (props) => {
	const { back, toggleHint, showingHint, answers } = props

	let my_answers = answers || { has_valid_ans: false }

	const [showSolutions, setShowSolutions] = useState(false)

	return (
		<div className='w-full'>
			<div className='w-full bg-purple-700 text-white rounded-b shadow-lg flex justify-between items-center p-2'>
				{/* Navbar */}
				<button
					onClick={() => {
						let confirm_response = window.confirm('Going Back?')
						if (confirm_response) back()
					}}
					className='inline-block w-24 py-1 rounded bg-purple-500 text-white font-bold'
				>
					Back
				</button>

				<div className='flex flex-wrap justify-center gap-x-2'>
					<p
						onClick={() => {
							let confirm_response = window.confirm(
								showSolutions ? 'Hide Solutions?' : 'Show Solutions?'
							)
							if (confirm_response) setShowSolutions(!showSolutions)
						}}
					>
						ZERO RUSH
					</p>

					<p className='opacity-50 hidden'>
						({my_answers.has_valid_ans ? my_answers.sunset.result : '-'} {' & '}
						{my_answers.has_valid_ans ? my_answers.sunrise.result : '-'})
					</p>
				</div>
				<button
					onClick={() => {
						toggleHint()
					}}
					className='inline-block py-1 w-24 rounded bg-purple-500 text-white font-bold'
				>
					{showingHint ? 'Hide Hint' : 'Show Hint'}
				</button>
			</div>
			<div
				className={`w-full flex flex-row justify-center items-center p-1 gap-1 ${
					showingHint ? 'opacity-100' : 'opacity-50'
				}`}
			>
				<span className='bg-green-800 py-1 px-3 text-white font-bold rounded-lg text-center'>
					<p>
						Sunset: {my_answers.has_valid_ans ? my_answers.sunset.result : '-'}
					</p>
					{showSolutions
						? my_answers.has_valid_ans
							? my_answers.sunset.answer
									.toString()
									.substring(1, my_answers.sunset.answer.toString().length)
							: '-'
						: null}
				</span>
				<span className='bg-blue-800 py-1 px-3 text-white font-bold rounded-lg text-center'>
					<p>
						Sunrise:
						{my_answers.has_valid_ans ? my_answers.sunrise.result : '-'}
					</p>
					{showSolutions
						? my_answers.has_valid_ans
							? my_answers.sunrise.answer
									.toString()
									.substring(1, my_answers.sunrise.answer.toString().length)
							: '-'
						: null}
				</span>
				{/* <p className='bg-blue-800 py-1 px-3 text-white font-bold rounded-lg'>
					Sunrise {my_answers.has_valid_ans ? my_answers.Sunrise.result : '-'}
				</p> */}
			</div>
		</div>
	)
}

export default GameScreen