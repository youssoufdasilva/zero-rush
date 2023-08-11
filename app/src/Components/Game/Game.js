import React, { useState } from 'react'
import { solvePuzzle } from './GameHelpers'
import TopBar from '../TopBar'

const GameScreen = (props) => {
	const { puzzle, answers, visible, back /* search */ } = props

	// const currentHand = visible && puzzle !== null ? puzzle.split(',') : []
	const max_solution = 6

	const [currentAttempt, setCurrentAttempt] = useState([])
	const [unusedAttempts, setUnusedAttempts] = useState([])
	const [currentSolution, setCurrentSolution] = useState({ answer: '0' })
	const [unusedSolutions, setUnusedSolutions] = useState([])
	const [allSolutions, setAllSolutions] = useState([])
	const [showingHint, setShowingHint] = useState(false)
	const [showingObjective, setShowingObjective] = useState(false)
	const [foundAnswers, setFoundAnswers] = useState([false, false])

	const updateUnusedAttempts = React.useCallback(() => {
		if (puzzle === null) return
		console.log("puzzle.split(', ').length :: ", puzzle.split(',').length)
		console.log('currentAttempt.length :: ', currentAttempt.length)

		let temp_unused_attempt = [],
			temp_unused_solutions = [], //2D array
			unused_attempt_size = puzzle.split(',').length - currentAttempt.length,
			unused_solution_size = max_solution - allSolutions.length

		// console.log('unused_size :: ', unused_attempt_size)

		for (let i = 0; i < unused_attempt_size; i++) {
			temp_unused_attempt.push('')
		}
		setUnusedAttempts(temp_unused_attempt)

		for (let j = 0; j < unused_solution_size - 1; j++) {
			let blank_attempts = []
			for (let k = 0; k < puzzle.split(',').length; k++) {
				blank_attempts.push('')
			}
			temp_unused_solutions.push(blank_attempts)
		}
		setUnusedSolutions(temp_unused_solutions)
	}, [puzzle, currentAttempt, max_solution, allSolutions])

	// const updateUnusedAttemptsMemo = React.useMemo(
	// 	() => updateUnusedAttempts(),
	// 	[]
	// )

	React.useEffect(() => {
		if (puzzle && visible) {
			console.log(
				'currentAttempt.length + unusedAttempts.length :: ',
				currentAttempt.length + unusedAttempts.length
			)
			if (
				currentAttempt.length + unusedAttempts.length !==
				puzzle.split(',').length
			) {
				updateUnusedAttempts()
				console.log("puzzle.split(', ').length :: ", puzzle.split(',').length)
				console.log('currentAttempt.length :: ', currentAttempt.length)
			}
		}
	}, [unusedAttempts, currentAttempt, puzzle, visible, updateUnusedAttempts])

	if (puzzle === null) {
		back()
		// setCurrentSolution({ answer: '0' })

		if (visible) window.location.reload(false)
		return null
	}

	const moveToAttempt = (card) => {
		// console.log('Moving: ', card)

		let temp_attempt = currentAttempt
		temp_attempt.push(card)
		setCurrentAttempt(temp_attempt)

		// if (temp_attempt.length > 1) {
		let temp_solution = solvePuzzle(temp_attempt)
		setCurrentSolution(temp_solution)
		// console.log('SOLUTION = ', temp_solution)

		if (temp_attempt.length === puzzle.split(',').length) {
			// wait 1 second
			setTimeout(() => {
				let temp_all_sols = allSolutions
				let temp_att_string = temp_attempt.toString()
				temp_all_sols.push({
					attempt: temp_att_string.substring(1, temp_att_string.length),
					solution: Math.round(temp_solution.answer * 100) / 100,
				})
				setAllSolutions(temp_all_sols)
				setCurrentAttempt([])
				setCurrentSolution({ answer: '0' })

				if (temp_solution.answer.toString() === answers.sunset.result) {
					let temp_found_answers = foundAnswers
					temp_found_answers[0] = true
					setFoundAnswers(temp_found_answers)
					// alert('Congratulations On Finding the LOWEST Possible Valid Answer! ')
				}

				if (temp_solution.answer.toString() === answers.sunrise.result) {
					let temp_found_answers = foundAnswers
					temp_found_answers[1] = true
					setFoundAnswers(temp_found_answers)
					// alert(
					// 	'Congratulations On Finding the HIGHEST Possible Valid Answer! '
					// )
				}

				if (foundAnswers[0] && foundAnswers[1]) {
					setShowingHint(true)
				}
			}, 1000)
		}

		updateUnusedAttempts()
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

		updateUnusedAttempts()
	}

	return (
		<div
			style={visible ? { display: 'flex' } : { display: 'none' }}
			className='h-screen flex-col justify-between items-center font-bold w-full bg-purple-200 md:max-w-md mx-auto my-0'
		>
			<TopBar
				totalSolutions={allSolutions.length}
				// back={() => {
				// 	setAllSolutions([])
				// 	setCurrentAttempt([])
				// 	back()
				// }}
				showingHint={showingHint}
				toggleHint={() => {
					// alert('pause game')
					setShowingHint(!showingHint)
				}}
				showingObjective={showingObjective}
				toggleObjective={() => {
					// alert('pause game')
					setShowingObjective(!showingObjective)
				}}
				answers={answers}
			/>

			<div className='flex flex-col w-full px-4'>
				<div className='flex flex-col flex-wrap items-center gap-2 p-2 mx-4 text-xs'>
					{foundAnswers[1] ? (
						<div className='text-center'>
							<p>Congrats! You Found all target answers!</p>

							<button
								onClick={() => {
									// setAllSolutions([])
									// setCurrentAttempt([])
									// setCurrentSolution('0')
									// back()
									// search()
									window.location.reload(false)
								}}
								className='bg-purple-500 rounded px-3 py-1 shadow-lg text-white font-bold'
							>
								Reload Page
							</button>
						</div>
					) : null}
				</div>
				{/* Past Solution */}
				<div className='flex flex-col items-center justify-center'>
					{allSolutions.map((this_solution, i) => {
						const valid_sunset =
							this_solution.solution.toString() === answers.sunset.result

						const valid_sunrise =
							this_solution.solution.toString() === answers.sunrise.result

						const invalid =
							this_solution.solution.toString().charAt(0) === '-' ||
							this_solution.solution.toString().split('.').length > 1

						let style

						if (valid_sunset) {
							style = 'text-white bg-blue-500 border-blue-500'
						} else if (valid_sunrise) {
							style = 'text-white bg-green-500 border-green-500'
						} else if (invalid) {
							style = 'text-white bg-red-500 border-red-500'
						} else {
							style = 'text-white bg-black border-black'
						}

						return (
							<li key={i} className={`flex gap-2 my-1 items-center`}>
								{this_solution.attempt.split(',').map((card, i) => {
									return (
										<div
											key={`${card}-${i}`}
											className={`border-gray-100x opacity-75x w-8 h-8 flex justify-center items-center rounded-full border-2  ${style}`}
										>
											{card}
										</div>
									)
								})}

								{/* <p className={`p-2 rounded-xl ${style}`}>
								= {this_solution.solution}
							</p> */}
								{/* Solution */}
								<div
									style={
										allSolutions.length === 10
											? { display: 'none' }
											: { display: 'flex' }
									}
									className=' flex-col flex-wrap items-center gap-2'
								>
									{/* <p className='text-2xl'>Solution: {currentSolution.answer}</p> */}
									<p
										className={`opacity-100 text-xs bg-whitex text-blackx border-4 border-blackx rounded-xl p-1 w-20  ${style}`}
									>
										= {this_solution.solution}
									</p>
								</div>
							</li>
						)
					})}
				</div>

				{/* Current Attempt */}
				<div
					className={`${
						allSolutions.length === max_solution ? 'none' : 'flex'
					} gap-2 my-2x w-full justify-center items-center`}
				>
					<div className='flex gap-2 my-2 '>
						{/* Attempt */}
						{currentAttempt !== []
							? currentAttempt.map((card, i) => {
									return (
										<div
											key={`${card}-${i}`}
											onClick={() => moveToHand(card)}
											className='bg-white border-white w-8 h-8 flex justify-center items-center rounded-full border-2'
										>
											{i !== 0 ? card : card.substring(1, card.length)}
										</div>
									)
							  })
							: null}

						{/* Unused Attempt */}
						{unusedAttempts !== []
							? unusedAttempts.map((emptyCard, i) => {
									return (
										<div
											key={`${emptyCard}-${i}`}
											// onClick={() => moveToHand(card)}
											className='bg-gray-100 border-gray-100 opacity-75 w-8 h-8 flex justify-center items-center rounded-full border-2'
										>
											{emptyCard}
										</div>
									)
							  })
							: null}
					</div>
					{/* Solution */}
					<div
						style={
							allSolutions.length === 10
								? { display: 'none' }
								: { display: 'flex' }
						}
						className=' flex-col flex-wrap items-center gap-2'
					>
						{/* <p className='text-2xl'>Solution: {currentSolution.answer}</p> */}
						<p
							className={`${
								currentAttempt.length === 0 ? 'bg-gray-100' : 'bg-white'
							} text-base bg-white text-black border-4 border-black rounded-xl p-1 w-20`}
						>
							= {currentSolution.answer}
						</p>
					</div>
				</div>

				{/* unused solutions */}
				<div style={{display: "none"}} className='flex flex-col items-center justify-center'>
					{unusedSolutions.map((solution) => {
						// console.log('unusedSolutions :: ', unusedSolutions)
						// console.log('solution :: ', solution)
						return (
							<div className='flex gap-2 bg-green-200x m-1 items-center justify-center'>
								{solution.map((emptyCard, i) => {
									return (
										<div
											key={`${emptyCard}-${i}`}
											className='bg-gray-100 border-gray-100 opacity-75 w-8 h-8 flex justify-center items-center rounded-full border-2'
										>
											{emptyCard}
										</div>
									)
								})}
								{/* Solution */}
								<div
									style={
										allSolutions.length === 10
											? { display: 'none' }
											: { display: 'flex' }
									}
									className=' flex-col flex-wrap items-center gap-2'
								>
									{/* <p className='text-2xl'>Solution: {currentSolution.answer}</p> */}
									<p
										className={`opacity-10 text-xl bg-white text-black border-4 border-black rounded-xl p-1 w-20`}
									>
										={' '}
									</p>
								</div>
							</div>
						)
					})}
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
				<div className='flex flex-col justify-center items-center mb-2 gap-2'>
					<div className='flex gap-2 border-white'>
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
											} p-2x w-10 h-10 flex flex-col justify-center items-center text-2xl rounded border-4 ${
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
					<div>
						<button
							className={
								currentAttempt.length === 0 ||
								currentAttempt.length === puzzle.split(',').length
									? '  bg-gray-400 h-12 px-4 m-4 rounded font-bold text-white'
									: 'bg-purple-800 h-12 px-4 m-4 rounded font-bold text-white'
							}
							onClick={() => {
								if (
									currentAttempt.length > 0 &&
									currentAttempt.length !== puzzle.split(',').length
								) {
									moveToHand(currentAttempt[currentAttempt.length - 1])
								}

								// setCurrentAttempt([])
								// setCurrentSolution({ answer: '0' })
								// window.location.reload(false)
							}}
						>
							DELETE
						</button>
					</div>
				</div>
			)}
		</div>
	)
}


export default GameScreen
