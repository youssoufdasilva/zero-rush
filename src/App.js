import React, { useState } from 'react'

import GameScreen from './Components/Game/Game'
import { generatePuzzle, generateAnswers } from './Components/Game/GameHelpers'

const App = () => {
	const [showWelcome, setShowWelcome] = useState(true)
	const [showGame, setShowGame] = useState(false)
	const [generatedPuzzle, setGeneratedPuzzle] = useState(null)
	const [generatedAnswers, setGeneratedAnswers] = useState(null)
	const [isRushing, setIsRushing] = useState(false)
	// const [rushCounter, setRushCounter] = useState(false)
	const [stopRush, setStopRush] = useState(false)

	const startGame = () => {
		setShowGame(true)
		setShowWelcome(false)
	}

	const findGoodPuzzleWithZero = (limit = 100) => {
		for (let i = 0; i < limit; ++i) {
			if (stopRush) {
				alert('breakkk')
				break
			}

			console.log('Attempt #', i)

			let my_puzzle_string = generatePuzzle()
			let my_answer_obj = generateAnswers(my_puzzle_string.split(','))

			if (my_answer_obj !== null && my_answer_obj.has_valid_ans) {
				// console.log('Checking ', my_answer_obj)

				let has_zero = my_answer_obj.sunset.result === '0'

				if (my_answer_obj.is_good && has_zero) {
					console.log('>  Good and has Zero Found at ', i)
					setGeneratedPuzzle(my_puzzle_string)
					setGeneratedAnswers(my_answer_obj)
					setIsRushing(false)
					break
				} else {
					console.log('Not Good Found at ', i)
					// setGeneratedPuzzle(my_puzzle_string)
					// setGeneratedAnswers(my_answer_obj)
					// break
				}
			}

			if (i === limit - 1) {
				searchPuzzle()
				setIsRushing(false)
				break
			}
		}
		setStopRush(false)
	}

	const searchPuzzle = () => {
		// console.log('Starting game...')
		setIsRushing(false)

		let my_puzzle_string = generatePuzzle()
		console.log('my_puzzle_string ', my_puzzle_string)
		setGeneratedPuzzle(my_puzzle_string)

		let my_answer_obj = generateAnswers(my_puzzle_string.split(','))
		console.log('my_answer_obj ', my_answer_obj)
		setGeneratedAnswers(my_answer_obj)
	}

	return (
		// Welcome Screen
		<div className='w-full md:max-w-md mx-auto my-0'>
			<WelcomeScreen
				visible={showWelcome}
				search={() => {
					searchPuzzle()
				}}
				rush={() => {
					setIsRushing(true)
					setTimeout(() => {
						setGeneratedPuzzle(null)
						findGoodPuzzleWithZero(10)
					}, 100)
				}}
				isRushing={isRushing}
			>
				<ConfirmPuzzle
					puzzle={generatedPuzzle}
					answers={generatedAnswers}
					start={() => {
						startGame()
					}}
					clear={() => {
						setGeneratedPuzzle(null)
						setGeneratedAnswers(null)
					}}
					isRushing={isRushing}
					// usedRush={usedRush}
					stopRush={() => {
						console.warn('Stopping Rush')
						setStopRush(true)
					}}
				/>
			</WelcomeScreen>

			<GameScreen
				puzzle={generatedPuzzle}
				answers={generatedAnswers}
				visible={showGame}
				back={() => {
					setGeneratedPuzzle(null)
					setGeneratedAnswers(null)
					setShowWelcome(true)
					setShowGame(false)
				}}
				search={() => {
					searchPuzzle()
				}}
			/>
		</div>
	)
}

const ConfirmPuzzle = (props) => {
	const { puzzle, answers, start, clear, isRushing, stopRush } = props

	const [showingStats, setShowingStats] = useState(false)

	if (puzzle === null && isRushing === false) return null

	let status, custom_style
	if (answers !== null && answers.has_valid_ans) {
		let has_zero = answers.sunset.result === '0'
		if (answers.is_good && has_zero) {
			custom_style = 'border-4 border-green-500 bg-green-500'
			status = "Let's Go!"
		} else if (answers.is_good) {
			custom_style = 'border-4 border-yellow-500'
			status = 'Decent!'
		} else if (has_zero) {
			custom_style = 'border-4 border-green-500'
			status = 'Has Zero!'
		} else {
			custom_style = 'border-4 border-yellow-200 bg-green-500'
			status = 'Meh!'
		}
	} else if (answers !== null && !answers.has_valid_ans) {
		custom_style = 'border-4 border-red-500'
		status = 'Nope!'
	}
	return (
		<div
			className={`min-w-1/2 w-1/2x px-4 bg-purple-800 rounded-xl shadow-xl text-white mx-auto my-4 ${custom_style}`}
		>
			<div
				className={
					isRushing
						? 'hidden'
						: 'flex flex-col justify-center items-center p-4 '
				}
			>
				<div
					className='text-center bg-purple-100 p-1 rounded text-black mb-4'
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
							</p>
							<p>
								Highest:{' '}
								{`${answers && answers.sunrise ? answers.sunrise.result : '-'}`}
							</p>
							<p>
								Status: {status} (
								{answers && answers.has_valid_ans && answers.all_answers
									? answers.all_answers
									: '-'}
								)
							</p>
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
				>
					Rushing!
				</p>
				<p>Please Wait...</p>
				<button
					className='text-purple-800 bg-white rounded px-4 py-1 font-bold mt-6'
					onClick={() => {
						alert('stopping...')
						stopRush()
					}}
				>
					Stop Rush
				</button>
			</div>
		</div>
	)
}

const WelcomeScreen = (props) => {
	const { visible, search, rush, isRushing, children } = props

	return (
		<div
			style={visible ? { display: 'flex' } : { display: 'none' }}
			className='h-screen flex-col justify-center items-center font-bold bg-purple-200'
		>
			<p className='text-3xl'>Welcome to</p>
			<p className='text-4xl'>ZERO RUSH!</p>
			<div>
				<button
					onClick={() => {
						search()
					}}
					className={
						!isRushing
							? 'mt-4 px-8 py-2 rounded bg-purple-800 text-white font-bold'
							: 'hidden'
					}
				>
					Generate Puzzle
				</button>

				<button
					onClick={() => {
						rush()
					}}
					className={
						!isRushing
							? `mt-4 ml-4 px-2 py-2 rounded-full bg-purple-800 text-white font-bold`
							: 'hidden'
					}
				>
					Rush
				</button>
			</div>
			{children}
		</div>
	)
}

export default App
