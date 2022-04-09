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
	const [rushFound, setRushFound] = useState(false)

	const startGame = () => {
		setShowGame(true)
		setShowWelcome(false)
	}

	const findGoodPuzzleWithZero = (limit = 100) => {
		setGeneratedPuzzle(null)
		setGeneratedAnswers(null)

		for (let i = 0; i < limit; ++i) {
			// if (stopRush) {
			// 	alert('breakkk')
			// 	break
			// }

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
					setRushFound(true)
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
		// setStopRush(false)
	}

	const searchPuzzle = (experiement = false) => {
		// console.log('Starting game...')
		setIsRushing(false)
		setRushFound(false)

		let my_puzzle_string

		if (experiement) {
			my_puzzle_string = generatePuzzle(
				5,
				{ min: 1, max: 9 }, //plusRange
				{ min: 1, max: 9 }, //minusRange
				{ min: 1, max: 9 }, //multRange
				{ min: 1, max: 9 } //divRange
			)
		} else {
			my_puzzle_string = generatePuzzle()
		}
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
				experiemtalSearch={() => {
					searchPuzzle(true)
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
				<React.Fragment>
					{/* {isRushing} */}
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
						rushFound={rushFound}
					/>
				</React.Fragment>
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
	const { puzzle, answers, start, clear, isRushing, rushFound } = props

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
			status = 'Not Garbage!'
		}
	} else if (answers !== null && !answers.has_valid_ans) {
		custom_style = 'border-4 border-red-500'
		status = 'Nope, Garbage!'
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
				{rushFound ? (
					<p className='mb-2'>Easier Puzzle Found!</p>
				) : (
					<p className='mb-2'>Random Puzzle!</p>
				)}
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
								{` (# of perm: ${
									answers && answers.sunset
										? answers.sunset.permutationCount
										: '-'
								})`}
							</p>
							<p>
								Highest:{' '}
								{`${answers && answers.sunrise ? answers.sunrise.result : '-'}`}
								{` (# of perm: ${
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

const WelcomeScreen = (props) => {
	const { visible, search, experiemtalSearch, rush, isRushing, children } =
		props

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
						experiemtalSearch()
					}}
					className={
						!isRushing
							? 'm-4 px-4 py-2 rounded-full bg-purple-800 text-white font-bold'
							: 'hidden'
					}
				>
					?
				</button>

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
					Random Puzzle
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
